import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Client from '../models/Client.js';
import { asyncHandler } from '../utils/helpers.js';

// --- SERVICES ---
export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort('order');
  res.json({ success: true, data: services });
});

export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Service deleted' });
});

// --- TESTIMONIALS ---
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort('order');
  res.json({ success: true, data: testimonials });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
  res.json({ success: true, data: testimonial });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Testimonial deleted' });
});

// --- CLIENTS ---
export const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ isActive: true }).sort('order');
  res.json({ success: true, data: clients });
});

export const createClient = asyncHandler(async (req, res) => {
  const client = await Client.create(req.body);
  res.status(201).json({ success: true, data: client });
});

export const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
  res.json({ success: true, data: client });
});

export const deleteClient = asyncHandler(async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Client deleted' });
});
