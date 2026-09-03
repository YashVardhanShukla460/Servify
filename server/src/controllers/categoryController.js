/**
 * Category Controller
 *
 * Public routes (anyone):
 *   GET /api/categories          - list all active categories
 *   GET /api/categories/:id      - single category
 *
 * Admin routes (requireAuth + requireRole('admin')):
 *   POST   /api/categories       - create a category
 *   PATCH  /api/categories/:id   - update a category
 */

import Category from '../models/Category.js'
import Service  from '../models/Service.js'
import { sendSuccess, sendError } from '../utils/response.js'

// ─────────────────────────────────────────────
// GET /api/categories  — Public
// ─────────────────────────────────────────────
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .lean() // .lean() returns plain JS objects (faster — no Mongoose overhead)

    return sendSuccess(res, { categories, count: categories.length })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// GET /api/categories/:id  — Public
// ─────────────────────────────────────────────
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).lean()

    if (!category) {
      return sendError(res, 'Category not found.', 404)
    }

    return sendSuccess(res, { category })
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// POST /api/categories  — Admin only
// ─────────────────────────────────────────────
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, image, sortOrder } = req.body

    if (!name?.trim()) {
      return sendError(res, 'Category name is required.', 400)
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim(),
      icon: icon?.trim(),
      image: image?.trim(),
      sortOrder: sortOrder || 0,
    })

    return sendSuccess(res, { category }, 'Category created successfully.', 201)
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// PATCH /api/categories/:id  — Admin only
// ─────────────────────────────────────────────
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, image, isActive, sortOrder } = req.body

    const category = await Category.findById(req.params.id)
    if (!category) {
      return sendError(res, 'Category not found.', 404)
    }

    // Only update fields that were actually sent in the request
    if (name       !== undefined) category.name        = name.trim()
    if (description!== undefined) category.description = description.trim()
    if (icon       !== undefined) category.icon        = icon.trim()
    if (image      !== undefined) category.image       = image
    if (isActive   !== undefined) category.isActive    = isActive
    if (sortOrder  !== undefined) category.sortOrder   = sortOrder

    await category.save()

    return sendSuccess(res, { category }, 'Category updated successfully.')
  } catch (error) {
    next(error)
  }
}

// ─────────────────────────────────────────────
// GET /api/categories/admin/all  — Admin only
// Returns ALL categories including inactive
// ─────────────────────────────────────────────
export const getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .sort({ sortOrder: 1, name: 1 })
      .lean()

    return sendSuccess(res, { categories, count: categories.length })
  } catch (error) {
    next(error)
  }
}
