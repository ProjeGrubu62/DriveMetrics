import { describe, it, expect } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

describe('Analysis API Tests', () => {
  describe('GET /api/analysis', () => {
    it('should return analysis data', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/analysis');
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBeTruthy();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should handle query parameters', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/analysis?vehicleId=1&startDate=2023-01-01'
      );
      const response = await GET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBeTruthy();
    });

    it('should handle invalid query parameters', async () => {
      const mockRequest = new NextRequest(
        'http://localhost:3000/api/analysis?vehicleId=invalid'
      );
      const response = await GET(mockRequest);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/analysis', () => {
    it('should create new analysis', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/analysis', {
        method: 'POST',
        body: JSON.stringify({
          vehicleId: '1',
          startTime: Date.now() - 3600000,
          endTime: Date.now(),
          averageSpeed: 65,
          maxSpeed: 120,
          totalDistance: 50,
          fuelConsumption: 5.8
        })
      });

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
    });

    it('should validate request body', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/analysis', {
        method: 'POST',
        body: JSON.stringify({
          // Missing required fields
          vehicleId: '1'
        })
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(400);
    });

    it('should handle invalid vehicle ID', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/analysis', {
        method: 'POST',
        body: JSON.stringify({
          vehicleId: 'invalid',
          startTime: Date.now() - 3600000,
          endTime: Date.now(),
          averageSpeed: 65,
          maxSpeed: 120,
          totalDistance: 50,
          fuelConsumption: 5.8
        })
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(404);
    });

    it('should handle invalid data ranges', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/analysis', {
        method: 'POST',
        body: JSON.stringify({
          vehicleId: '1',
          startTime: Date.now(),
          endTime: Date.now() - 3600000, // End time before start time
          averageSpeed: 65,
          maxSpeed: 120,
          totalDistance: 50,
          fuelConsumption: 5.8
        })
      });

      const response = await POST(mockRequest);
      expect(response.status).toBe(400);
    });
  });
});