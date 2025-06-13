# Moneybox Technical Task

## Analytics Events

The application tracks user interactions with the product carousel using Vercel Analytics:

### Carousel Navigation

#### Button Navigation
- Event: `carousel_navigation`
- Properties:
  - `direction`: 'prev' | 'next'
  - `category`: string (name of the current category)

#### Swipe Navigation
- Event: `carousel_swipe`
- Properties:
  - `category`: string (name of the current category)

### Product Interactions

#### Accordion Interactions
- Event: `product_accordion_interaction`
- Properties:
  - `action`: 'open' | 'close'
  - `product`: string (name of the product)
  - `category`: string (name of the parent category)

## Data Revalidation

The application implements automatic data revalidation to ensure content stays up to date with Sanity:

- Data is revalidated every 60 seconds
- Changes made in Sanity will be reflected in the application within this timeframe
- Both the web interface and API endpoint will serve the latest data after revalidation
- No manual refresh is required to see updates

## API Endpoints

### GET /api/categories

Returns a list of all product categories and their associated products.

#### Response

```json
[
  {
    "_id": "string",
    "name": "string",
    "products": [
      {
        "_id": "string",
        "name": "string",
        "icon": "string (optional)",
        "description": ["string"]
      }
    ]
  }
]
```

#### Example Response

```json
[
  {
    "_id": "category1",
    "name": "Savings",
    "products": [
      {
        "_id": "product1",
        "name": "Lifetime ISA",
        "icon": "https://example.com/icon.png",
        "description": [
          "Save up to £4,000 each tax year",
          "Get a 25% government bonus",
          "Use towards your first home or retirement"
        ]
      }
    ]
  }
]
```

#### Error Response

```json
{
  "error": "Failed to fetch categories"
}
```

#### Status Codes

- 200: Success
- 500: Server Error

## Future Improvements

Given the 3 hour time constraint, here are the key improvements that would be implemented with more time:

- Comprehensive testing suite using Jest and React Testing Library for unit tests, and Playwright for end to end testing
- Performance optimisations including proper code splitting, memoization, and reducing client side components
- Implement Incremental Static Regeneration (ISR) since carousel data doesn't change frequently
- Add proper ESLint rules and Prettier configuration for consistent code quality
- Improve accessibility with proper ARIA labels and keyboard navigation
- Set up proper error boundaries and fallback UI components