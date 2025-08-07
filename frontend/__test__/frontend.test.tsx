import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { IMyPlace as IPlace } from '../../backend/src/types';
import LegendItem from '../src/features/legend/components/LegendItem';
import TradeAreaLegend from '../src/features/legend/components/TradeAreaLegend';
import HomeZipcodeLegend from '../src/features/legend/components/HomeZipcodeLegend';
import MapTooltip from '../src/features/map/components/MapTooltip';
import CustomerAnalysis from '../src/features/sidebar/components/CustomerAnalysis';
import RightSidebar from '../src/features/sidebar/components/RightSidebar';
import { useCustomerAnalysis } from '../src/store/useCustomerAnalysis';

// Mocking the Zustand store
jest.mock('../src/store/useCustomerAnalysis');
const mockedUseCustomerAnalysis = useCustomerAnalysis as jest.MockedFunction<typeof useCustomerAnalysis>;

describe('LegendItem', () => {
    const mockProps = {
        title: 'Test Title',
        color: '#ff0000',
        label: 'Test Label',
    };

    test('Render Test', () => {
        render(<LegendItem {...mockProps} />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
});

describe('TradeAreaLegend', () => {
    test('Render Test', () => {
        render(<TradeAreaLegend />);
        expect(screen.getByText('Trade Area')).toBeInTheDocument();
        expect(screen.getByText('Primary')).toBeInTheDocument();
        expect(screen.getByText('Secondary')).toBeInTheDocument();
        expect(screen.getByText('Tertiary')).toBeInTheDocument();
    });
});

describe('HomeZipcodeLegend', () => {
    test('Render Test', () => {
        render(<HomeZipcodeLegend />);
        expect(screen.getByText('Customer Zip Codes')).toBeInTheDocument();
        expect(screen.getByText('Count 0-1')).toBeInTheDocument();
        expect(screen.getByText('Count 2-3')).toBeInTheDocument();
        expect(screen.getByText('Count 4-5')).toBeInTheDocument();
        expect(screen.getByText('Count 6-7')).toBeInTheDocument();
        expect(screen.getByText('Count 8+')).toBeInTheDocument();
    });
});

describe('MapTooltip', () => {
    const mockData = {
        zipcode: '12345',
        customerCount: 150,
        homeZipcodeCount: 25,
        tradeAreaName: 'Center',
        competitorCount: 5,
    };

    test('Render Test', () => {
        render(<MapTooltip {...mockData} />);
        expect(screen.getByText('12345')).toBeInTheDocument();
        expect(screen.getByText('Customer Count: 150')).toBeInTheDocument();
        expect(screen.getByText('Home Zipcode Count: 25')).toBeInTheDocument();
        expect(screen.getByText('Trade Area: Center')).toBeInTheDocument();
        expect(screen.getByText('Competitor Count: 5')).toBeInTheDocument();
    });
});


describe('CustomerAnalysis', () => {
    test('renders with selected zip codes', () => {
        mockedUseCustomerAnalysis.mockReturnValue({
            customerOrigin: {
                '12345': 150,
                '54321': 25,
            },
            setSelectedZipcode: jest.fn(),
        });

        render(<CustomerAnalysis />);

        expect(
            screen.getByText('Customer Analysis by Zip Code')
        ).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('54321')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
    });

    test('renders message when no zip code is selected', () => {
        mockedUseCustomerAnalysis.mockReturnValue({
            customerOrigin: {},
            setSelectedZipcode: jest.fn(),
        });

        render(<CustomerAnalysis />);

        expect(
            screen.getByText('Select a location to see customer analysis.')
        ).toBeInTheDocument();
    });
});

describe('RightSidebar', () => {
    const mockPlace: IPlace = {
        type: 'Feature',
        properties: {
            id: '1',
            name: 'Test Place',
            competitors: [],
            tradeArea: {
                type: 'Feature',
                properties: { name: 'Center' },
                geometry: { type: 'Polygon', coordinates: [] },
            },
            customerOrigin: {
                '12345': 10,
                '54321': 20,
            },
        },
        geometry: { type: 'Point', coordinates: [0, 0] },
    };

    test('renders with a selected place', () => {
        render(<RightSidebar selectedPlace={mockPlace} />);
        expect(screen.getByText('Competitor Markets')).toBeInTheDocument();
        expect(screen.getByText('Trade Area')).toBeInTheDocument();
        expect(screen.getByText('Customer Zip Codes')).toBeInTheDocument();
    });

    test('renders null when no place is selected', () => {
        render(<RightSidebar selectedPlace={null} />);
        expect(screen.queryByText('Competitor Markets')).not.toBeInTheDocument();
    });
});
