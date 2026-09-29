const prisma = require('../services/prisma');
const { sendContactReplyEmail } = require('../services/emailService');

/**
 * Authenticated: Submit contact inquiry or complaint
 * Strictly requires authenticated session (req.user)
 */
async function submitContact(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to submit inquiries or complaints.'
      });
    }

    const { subject, message, phone } = req.body;
    const name = (req.body.name || user.name || 'Participant').trim();
    const email = (user.email || req.body.email || '').toLowerCase().trim();

    if (!subject || !subject.trim() || !message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required.'
      });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone ? phone.trim() : (user.phone ? user.phone.trim() : null),
        subject: subject.trim(),
        message: message.trim(),
        status: 'UNREAD'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your complaint/inquiry has been received and routed to the COLORIDO 2K26 coordination team.',
      data: contact
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get contact messages
 */
async function getContactMessages(req, res, next) {
  try {
    const { status, page = 1, limit = 25 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const where = {};

    if (status && ['UNREAD', 'READ', 'RESOLVED'].includes(status.toUpperCase())) {
      where.status = status.toUpperCase();
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contactMessage.count({ where })
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        pages: Math.ceil(total / take)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update contact message status
 */
async function updateContactStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['UNREAD', 'READ', 'RESOLVED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: status.toUpperCase() }
    });

    res.json({
      success: true,
      message: `Message status updated to ${status.toUpperCase()}`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Reply directly to contact inquiry via email and resolve
 */
async function replyContactMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { replyText, subject } = req.body;

    if (!replyText || !replyText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message text is required.'
      });
    }

    const contact = await prisma.contactMessage.findUnique({ where: { id } });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Send formatted email to user
    const emailResult = await sendContactReplyEmail({
      to: contact.email,
      recipientName: contact.name,
      subject: subject ? subject.trim() : `Re: ${contact.subject} — COLORIDO 2K26 Helpdesk`,
      replyText: replyText.trim(),
      originalSubject: contact.subject,
      originalMessage: contact.message
    });

    // Update status to RESOLVED
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: 'RESOLVED' }
    });

    res.json({
      success: true,
      message: `Official reply sent successfully to ${contact.email} and marked as RESOLVED.`,
      data: updated,
      emailSent: emailResult.success
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete contact message
 */
async function deleteContactMessage(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await prisma.contactMessage.delete({ where: { id } });
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitContact,
  getContactMessages,
  updateContactStatus,
  replyContactMessage,
  deleteContactMessage
};

