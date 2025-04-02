import { render, screen, fireEvent } from '@testing-library/react';
import ManualDataEntry from './ManualDataEntry';

describe('ManualDataEntry Component Tests', () => {
  it('renders manual data entry form', () => {
    render(<ManualDataEntry onSubmit={() => {}} />);
    expect(screen.getByText(/Manuel Veri Girişi/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ManualDataEntry onSubmit={() => {}} />);
    const submitButton = screen.getByRole('button', { name: /Kaydet/i });
    
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/Vites sayısı gerekli/i)).toBeInTheDocument();
    expect(await screen.findByText(/Debriyaj kullanım sayısı gerekli/i)).toBeInTheDocument();
    expect(await screen.findByText(/Fren kullanım sayısı gerekli/i)).toBeInTheDocument();
  });

  it('submits form with valid data', () => {
    const mockSubmit = jest.fn();
    render(<ManualDataEntry onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Vites Sayısı/i), {
      target: { value: '50' }
    });
    fireEvent.change(screen.getByLabelText(/Debriyaj Kullanım/i), {
      target: { value: '75' }
    });
    fireEvent.change(screen.getByLabelText(/Fren Kullanım/i), {
      target: { value: '30' }
    });
    fireEvent.change(screen.getByLabelText(/Ani Fren/i), {
      target: { value: '5' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Kaydet/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      gearShiftCount: 50,
      clutchUsageCount: 75,
      brakeUsageCount: 30,
      emergencyBrakeCount: 5
    });
  });

  it('validates gear shift range', async () => {
    render(<ManualDataEntry onSubmit={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/Vites Sayısı/i), {
      target: { value: '500' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Kaydet/i }));
    
    expect(await screen.findByText(/Vites sayısı 200'den az olmalı/i)).toBeInTheDocument();
  });

  it('validates emergency brake count is less than total brake usage', async () => {
    render(<ManualDataEntry onSubmit={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/Fren Kullanım/i), {
      target: { value: '20' }
    });
    fireEvent.change(screen.getByLabelText(/Ani Fren/i), {
      target: { value: '30' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Kaydet/i }));
    
    expect(await screen.findByText(/Ani fren sayısı toplam fren kullanımından fazla olamaz/i)).toBeInTheDocument();
  });

  it('validates clutch usage count range', async () => {
    render(<ManualDataEntry onSubmit={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/Debriyaj Kullanım/i), {
      target: { value: '300' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Kaydet/i }));
    
    expect(await screen.findByText(/Debriyaj kullanım sayısı 200'den az olmalı/i)).toBeInTheDocument();
  });
});