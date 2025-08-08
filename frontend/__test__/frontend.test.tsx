import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import type { Place } from '../src/types';
import LegendItem from '../src/features/legend/components/LegendItem';
import TradeAreaLegend from '../src/features/legend/components/TradeAreaLegend';
import HomeZipcodeLegend from '../src/features/legend/components/HomeZipcodeLegend';
import MapTooltip from '../src/features/map/components/MapTooltip';
import CustomerAnalysis from '../src/features/sidebar/components/CustomerAnalysis';
import RightSidebar from '../src/features/legend/RightSidebar';
import type { DeckGLPickInfo } from '../src/store/useMapStateStore';
import { useCustomerAnalysis } from '../src/store/useCustomerAnalysis';

// Mocking the Zustand store
jest.mock('../src/store/useCustomerAnalysis');
jest.mock('../src/store/useMapStateStore');
jest.mock('../src/hooks/useCustomerLayerLogic', () => ({
    useCustomerLayerLogic: () => ({
        handleToggleTradeArea: jest.fn(),
        handleToggleHomeZipcodes: jest.fn(),
    }),
}));

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
    const mockPlace: Place = {
        _id: '1',
        placeId: '1',
        name: 'Test Place',
        address: '123 Main St, Test City',
        industry: 'Testing',
        location: {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: {},
        },
        hasTradeArea: true,
        hasHomeZipcodes: true,
        isMyPlace: true
    };

    const mockInfo: DeckGLPickInfo = {
        x: 10,
        y: 20,
        object: mockPlace,
        index: 0,
        layer: {} as any,
        coordinate: [0,0],
        color: null,
        pixel: [10, 20],
        pixelRatio: 1,
        picked: false
    };

    test('renders with a selected place', () => {
        mockedUseCustomerAnalysis.mockReturnValue({ dataType: 'Trade Area' } as any);
        render(<MapTooltip info={mockInfo} isPinned={false} />);
        expect(screen.getByText('Test Place')).toBeInTheDocument();
        expect(screen.getByText('123 Main St, Test City')).toBeInTheDocument();
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
    test('renders TradeAreaLegend when dataType is Trade Area', () => {
        mockedUseCustomerAnalysis.mockReturnValue({
            dataType: 'Trade Area',
            selectedTradeAreaPercentages: [30, 50, 70],
        } as any);

        render(<RightSidebar />);
        expect(screen.getByText('Trade Area')).toBeInTheDocument();
    });

    test('renders HomeZipcodeLegend when dataType is Home Zipcodes', () => {
        mockedUseCustomerAnalysis.mockReturnValue({
            dataType: 'Home Zipcodes',
        } as any);

        // HomeZipcodeLegend'in bir metnini kontrol edelim
        render(<RightSidebar />);
        expect(screen.getByText('Customer Zip Codes')).toBeInTheDocument();
    });
});
