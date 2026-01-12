const Service = require('../models/Service');
const Transaction = require('../models/Transaction');

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { title, description, category, price, deliveryTime, tags } = req.body;
    
    const service = new Service({
      title,
      description,
      category,
      price,
      deliveryTime,
      seller: req.user._id,
      tags: tags || []
    });

    await service.save();

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// Get all services with filters
exports.getServices = async (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20 
    } = req.query;

    // Build query
    const query = { status: 'active' };
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;

    const services = await Service.find(query)
      .populate('seller', 'name email department rating')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(query);

    res.json({
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('seller', 'name email department rating skills bio');

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

// Get services by current user (seller)
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({ error: 'Failed to fetch your services' });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found or not authorized' });
    }

    const updates = req.body;
    const allowedUpdates = ['title', 'description', 'price', 'deliveryTime', 'status', 'tags'];
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        service[key] = updates[key];
      }
    });

    await service.save();

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found or not authorized' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

// Request a service (create transaction)
exports.requestService = async (req, res) => {
  try {
    const { serviceId, requirements } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Can't request own service
    if (service.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot request your own service' });
    }

    const transaction = new Transaction({
      buyer: req.user._id,
      seller: service.seller,
      service: serviceId,
      amount: service.price,
      status: 'pending',
      'payment.advance.amount': service.price * 0.25,
      'payment.final.amount': service.price * 0.75,
      'workDetails.requirements': requirements
    });

    await transaction.save();

    // Increment request count
    service.requestCount += 1;
    await service.save();

    res.status(201).json({
      message: 'Service request sent successfully',
      transaction
    });
  } catch (error) {
    console.error('Request service error:', error);
    res.status(500).json({ error: 'Failed to request service' });
  }
};