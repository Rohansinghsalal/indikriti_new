# 4-Level Hierarchy Implementation

## Overview

This document provides an overview of the 4-level hierarchy implementation for the Indikriti e-commerce platform. The hierarchy consists of the following levels:

1. **Brand** - The top level of the hierarchy (e.g., Indikriti)
2. **Category** - The second level (e.g., Clothing, Accessories)
3. **Subcategory** - The third level (e.g., Tops, Bottoms)
4. **Product Type** - The fourth level (e.g., T-Shirts, Jeans)

## Implementation Details

### API Services

The hierarchy is implemented using the following API services:

- `HierarchyService` - Handles API calls for the 4-level hierarchy
- API endpoints for brands, categories, subcategories, and product types

### React Hooks

- `useHierarchy` - Custom hook to manage the hierarchical data

### UI Components

- `CategoryMenu` - Dropdown menu for navigating the hierarchy
- `CategoryHierarchy` - Component for displaying and selecting from the hierarchy
- `CategoryBreadcrumb` - Breadcrumb navigation for the hierarchy

## Testing

The implementation includes the following testing components:

- `test-hierarchy.js` - Node.js script for testing the API endpoints
- `TestHierarchy.jsx` - React component for testing the UI implementation
- `TestPage.jsx` - Page for displaying the test component

## Usage

### Running the API Tests

To run the API tests, execute the following command from the project root:

```bash
node run-test.js
```

### Testing the UI Implementation

To test the UI implementation, start the development server and navigate to the test page:

```bash
npm start
```

Then open your browser and go to `http://localhost:3000/test-hierarchy`.

## Navigation

The hierarchy is used for navigation throughout the site. Users can navigate through the hierarchy using the following components:

- The `CategoryMenu` dropdown in the header
- The `CategoryHierarchy` component on category pages
- The `CategoryBreadcrumb` component for showing the current location in the hierarchy

## Styling

The implementation uses Tailwind CSS for styling, with support for both light and dark modes.

## Future Improvements

- Add caching for improved performance
- Implement lazy loading for large hierarchies
- Add analytics tracking for hierarchy navigation