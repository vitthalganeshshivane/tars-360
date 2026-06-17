import Contact from '../models/Contact.js';
import Settings from '../models/Settings.js';
import { asyncHandler, APIFeatures, buildPagination } from '../utils/helpers.js';

// --- CONTACT ---
export const submitContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
});

export const getContacts = asyncHandler(async (req, res) => {
  const total = await Contact.countDocuments();
  const features = new APIFeatures(Contact.find(), { ...req.query, showAll: true }).filter().sort().paginate();
  const contacts = await features.query;
  const pagination = buildPagination(total, features.page, features.limit);
  res.json({ success: true, data: contacts, ...pagination, pagination });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
  res.json({ success: true, data: contact });
});

export const deleteContact = asyncHandler(async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Contact deleted' });
});

// --- SETTINGS ---
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json({ success: true, data: settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }
  res.json({ success: true, data: settings });
});
