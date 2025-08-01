/**
 * Retrieve Contentstack Page Data
 * 
 * This composable fetches and manages page data from Contentstack CMS using Nuxt's composables.
 * It supports regular content delivery functionality.
 * 
 * Features:
 * - Fetches page content based on URL parameter
 * - Handles data fetching with Nuxt's useAsyncData
 * - Implements type-safe Contentstack queries
 * 
 * Usage:
 * const { data, status, refresh } = await useGetPage("/about");
 */

import contentstack, { QueryOperation } from "@contentstack/delivery-sdk";
import type { Page } from "~/types";

// Define an asynchronous function to fetch page data based on the URL
export const useGetPage = async (url: string) => {
  // Use the useAsyncData hook to fetch data and manage its state
  const { data, status, refresh } = await useAsyncData(`page-${url}`, async () => {
    // Get the Nuxt app instance
    const { $stack } = useNuxtApp()

    // Fetch the page data from Contentstack
    const result = await $stack
      .contentType("page") // Specify the content type as 'page'
      .entry() // Access the entries of the content type
      .query() // Create a query to filter the entries
      .where("url", QueryOperation.EQUALS, url) // Filter entries where the 'url' field matches the provided URL
      .find<Page>(); // Execute the query and cast the result to the Page type

    // Check if there are any entries in the result
    if (result.entries) {
      const entry = result.entries[0] // Get the first entry from the result
      return entry; // Return the entry as the data
    }

  });
  // Return the data, status, and refresh function from useAsyncData
  return { data, status, refresh }
}