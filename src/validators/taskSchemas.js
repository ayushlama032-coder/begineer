const statusValues = ["todo", "in-progress", "done"];
const priorityValues = ["low", "medium", "high"];

function isIsoDate(value) {
  return !Number.isNaN(Date.parse(value));
}

export function validateCreateTask(input) {
  const errors = [];

  if (typeof input.title !== "string" || input.title.length < 2 || input.title.length > 120) {
    errors.push("title must be a string between 2 and 120 chars");
  }

  if (input.description !== undefined && (typeof input.description !== "string" || input.description.length > 2000)) {
    errors.push("description must be <= 2000 chars");
  }

  if (input.priority !== undefined && !priorityValues.includes(input.priority)) {
    errors.push("priority must be low, medium, or high");
  }

  if (input.dueDate !== undefined && (!isIsoDate(input.dueDate) || typeof input.dueDate !== "string")) {
    errors.push("dueDate must be a valid ISO date string");
  }

  return errors;
}

export function validateUpdateTask(input) {
  const errors = [];

  if (Object.keys(input).length === 0) {
    errors.push("at least one field is required");
  }

  if (input.title !== undefined && (typeof input.title !== "string" || input.title.length < 2 || input.title.length > 120)) {
    errors.push("title must be a string between 2 and 120 chars");
  }

  if (input.description !== undefined && (typeof input.description !== "string" || input.description.length > 2000)) {
    errors.push("description must be <= 2000 chars");
  }

  if (input.status !== undefined && !statusValues.includes(input.status)) {
    errors.push("status must be todo, in-progress, or done");
  }

  if (input.priority !== undefined && !priorityValues.includes(input.priority)) {
    errors.push("priority must be low, medium, or high");
  }

  if (input.dueDate !== undefined && input.dueDate !== null && (!isIsoDate(input.dueDate) || typeof input.dueDate !== "string")) {
    errors.push("dueDate must be null or valid ISO date string");
  }

  return errors;
}
