const prisma = require('../services/prisma');
const { sendContactReplyEmail } = require('../services/emailService');

/**
 * Public: Submit contact message
 */
async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are all required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        message: message.trim(),
        status: 'UNREAD'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent to the COLORIDO 2K26 coordination team.',
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

