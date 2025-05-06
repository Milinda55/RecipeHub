import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipeItems from './RecipeItems';

// Mock necessary dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLoaderData: () => ([]),
    useLocation: () => ({}),
    useNavigate: () => jest.fn(),
}));

jest.mock('../components/AuthContext.jsx', () => ({
    useAuthContext: () => ({
        isLoggedIn: false,
        user: null,
    }),
}));

const mockRecipes = [
    {
        _id: '1',
        title: 'Test Pancakes',
        time: '15 mins',
        category: 'Breakfast',
        coverImage: 'pancakes.jpg',
        instructions: 'Mix and cook',
        categories: ['Quick', 'Vegetarian']
    }
];

describe('RecipeItems Component', () => {
    beforeEach(() => {
        // Mock localStorage
        Storage.prototype.getItem = jest.fn(() => JSON.stringify([]));
    });

    test('renders recipe cards with correct data', () => {
        render(<RecipeItems filteredRecipes={mockRecipes} />);

        expect(screen.getByText('Test Pancakes')).toBeInTheDocument();
        expect(screen.getByText('15 mins')).toBeInTheDocument();
        expect(screen.getByText('Breakfast')).toBeInTheDocument();
    });

    test('shows no recipes message when empty', () => {
        render(<RecipeItems filteredRecipes={[]} />);
        expect(screen.getByText(/no recipes available/i)).toBeInTheDocument();
    });
});