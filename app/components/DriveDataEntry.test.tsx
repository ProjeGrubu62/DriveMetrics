import { render, screen, fireEvent } from '@testing-library/react';
import DriveDataEntry from './DriveDataEntry';

describe('DriveDataEntry Component Tests', () => {
  const mockDriveData = {
    id: '1',
    vehicleId: '1',
    startTime: Date.now() - 3600000,
    endTime: Date.now(),
    gearShifts: [],
    speedChanges: [
      { time: Date.now(), speed: 60, acceleration: 5, isSudden: true },
      { time: Date.now(), speed: 80, acceleration: 2, isSudden: false }
    ],
    brakeUsages: [
      { time: Date.now(), intensity: 0.8, isEmergency: true },
      { time: Date.now(), intensity: 0.3, isEmergency: false }
    ],
    clutchUsages: [
      { time: Date.now(), duration: 1.5, isHardRelease: true },
      { time: Date.now(), duration: 0.5, isHardRelease: false }
    ],
    averageSpeed: 65,
    maxSpeed: 120,
    totalDistance: 50,
    fuelConsumption: 5.8,
    drivingStyle: 'normal',
    clutchHealth: 85
  };

  it('renders drive data entry form', () => {
    render(<DriveDataEntry onSubmit={() => {}} />);
    expect(screen.getByText(/Sürüş Verisi Girişi/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<DriveDataEntry onSubmit={() => {}} />);
    const submitButton = screen.getByRole('button', { name: /Kaydet/i });
    
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/Ortalama hız gerekli/i)).toBeInTheDocument();
    expect(await screen.findByText(/Maksimum hız gerekli/i)).toBeInTheDocument();
    expect(await screen.findByText(/Mesafe gerekli/i)).toBeInTheDocument();
  });

  it('submits form with valid data', () => {
    const mockSubmit = jest.fn();
    render(<DriveDataEntry onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Ortalama Hız/i), {
      target: { value: '65' }
    });
    fireEvent.change(screen.getByLabelText(/Maksimum Hız/i), {
      target: { value: '120' }
    });
    fireEvent.change(screen.getByLabelText(/Mesafe/i), {
      target: { value: '50' }
    });
    fireEvent.change(screen.getByLabelText(/Yakıt Tüketimi/i), {
      target: { value: '5.8' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Kaydet/i }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      averageSpeed: 65,
      maxSpeed: 120,
      distance: 50,
      fuelUsed: 5.8
    });
  });

  it('validates speed range', async () => {
    render(<DriveDataEntry onSubmit={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/Maksimum Hız/i), {
      target: { value: '250' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Kaydet/i }));
    
    expect(await screen.findByText(/Maksimum hız 200 km/s'den az olmalı/i)).toBeInTheDocument();
  });

  it('validates average speed is less than max speed', async () => {
    render(<DriveDataEntry onSubmit={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/Ortalama Hız/i), {
      target: { value: '100' }
    });
    fireEvent.change(screen.getByLabelText(/Maksimum Hız/i), {
      target: { value: '80' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Kaydet/i }));
    
    expect(await screen.findByText(/Ortalama hız maksimum hızdan büyük olamaz/i)).toBeInTheDocument();
  });
});