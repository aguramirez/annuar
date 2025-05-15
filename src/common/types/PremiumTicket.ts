export interface PremiumTicket {
  id: string;
  userId: string;
  issueDate: string; // When the ticket was issued
  expiryDate: string; // When the ticket expires
  status: 'available' | 'used' | 'expired';
  usedForMovieId?: string;
  usedForMovieTitle?: string;
  usedDate?: string;
}

// Mock data service for premium tickets
export const getUserPremiumTickets = (userId: string): PremiumTicket[] => {
  // This is a mock implementation - in a real app this would fetch from an API
  return [
    {
      id: 'pt-1',
      userId,
      issueDate: '2025-03-01',
      expiryDate: '2025-05-31',
      status: 'available'
    },
    {
      id: 'pt-2',
      userId,
      issueDate: '2025-03-01',
      expiryDate: '2025-05-31',
      status: 'available'
    },
    {
      id: 'pt-3',
      userId,
      issueDate: '2025-02-01',
      expiryDate: '2025-04-30',
      status: 'available'
    },
    {
      id: 'pt-4',
      userId,
      issueDate: '2025-02-01',
      expiryDate: '2025-04-30',
      status: 'used',
      usedForMovieId: '2',
      usedForMovieTitle: 'Capitan America: Un Nuevo Mundo',
      usedDate: '2025-03-15'
    },
    {
      id: 'pt-5',
      userId,
      issueDate: '2025-01-01',
      expiryDate: '2025-03-31',
      status: 'available'
    },
    {
      id: 'pt-6',
      userId,
      issueDate: '2025-01-01',
      expiryDate: '2025-03-31',
      status: 'used',
      usedForMovieId: '1',
      usedForMovieTitle: 'Minecraft',
      usedDate: '2025-03-20'
    }
  ];
};