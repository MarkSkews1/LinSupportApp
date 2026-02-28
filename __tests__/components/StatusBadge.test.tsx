import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/tickets/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders open status correctly', () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('renders resolved status correctly', () => {
    render(<StatusBadge status="resolved" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('renders closed status correctly', () => {
    render(<StatusBadge status="closed" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });

  it('renders in-progress status correctly', () => {
    render(<StatusBadge status="in-progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders pending status correctly', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('applies correct styling for each status', () => {
    const { rerender } = render(<StatusBadge status="open" />);
    let badge = screen.getByText('Open');
    expect(badge).toHaveClass('bg-blue-100');

    rerender(<StatusBadge status="resolved" />);
    badge = screen.getByText('Resolved');
    expect(badge).toHaveClass('bg-green-100');
  });
});

