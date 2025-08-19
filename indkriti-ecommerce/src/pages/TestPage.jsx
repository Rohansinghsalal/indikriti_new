import React from 'react';
import TestHierarchy from '../components/category/TestHierarchy';

/**
 * TestPage component for testing the 4-level hierarchy implementation
 * This page displays the TestHierarchy component within the Layout
 * @returns {JSX.Element} The TestPage component
 */
const TestPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Hierarchy Testing Page</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        This page is used to test the 4-level hierarchy implementation. You can interact with the
        hierarchy components below to verify that they are working correctly.
      </p>
      <TestHierarchy />
    </div>
  );
};

export default TestPage;