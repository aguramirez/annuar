// src/common/hooks/useReservationQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reservationService, { ReservationRequest, ReservationResponse } from '../services/reservationService';
import orderService, { OrderRequest, OrderResponse, OrderDetailsResponse } from '../services/orderService';

/**
 * Hook to create a reservation
 */
export const useCreateReservation = () => {
  return useMutation({
    mutationFn: (data: ReservationRequest) => reservationService.createReservation(data),
  });
};

/**
 * Hook to get reservation details
 */
export const useReservation = (id: string) => {
  return useQuery({
    queryKey: ['reservations', id],
    queryFn: () => reservationService.getReservationById(id),
    enabled: !!id, // Only run if id is provided
    refetchInterval: 10000, // Poll every 10 seconds to check for expiration
  });
};

/**
 * Hook to cancel a reservation
 */
export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => reservationService.cancelReservation(id),
    onSuccess: (_, id) => {
      // Invalidate the reservation data after cancellation
      queryClient.invalidateQueries({ queryKey: ['reservations', id] });
    },
  });
};

/**
 * Hook to create an order from a reservation
 */
export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: OrderRequest) => orderService.createOrder(data),
  });
};

/**
 * Hook to get order details
 */
export const useOrderDetails = (id: string) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrderDetailsById(id),
    enabled: !!id, // Only run if id is provided
  });
};

/**
 * Hook to get order tickets with QR codes
 */
export const useOrderTickets = (id: string) => {
  return useQuery({
    queryKey: ['orders', id, 'tickets'],
    queryFn: () => orderService.getOrderTickets(id),
    enabled: !!id, // Only run if id is provided
  });
};

/**
 * Hook to get the user's order history
 */
export const useUserOrders = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ['users', 'me', 'orders', page, size],
    queryFn: () => orderService.getUserOrders(page, size),
  });
};

/**
 * Hook for POS order creation
 */
export const useCreatePosOrder = () => {
  return useMutation({
    mutationFn: (data: OrderRequest) => orderService.createPosOrder(data),
  });
};

/**
 * Hook to print tickets at POS
 */
export const usePrintTickets = () => {
  return useMutation({
    mutationFn: (id: string) => orderService.printTickets(id),
  });
};