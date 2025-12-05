import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { App } from '../App';

describe('App integration flow', () => {
  it('solves a small system via the UI', async () => {
    render(<App />);

    const sizeInput = screen.getByLabelText('System size');
    await userEvent.clear(sizeInput);
    await userEvent.type(sizeInput, '2');

    const matrixSection = screen.getByText('Matrix A').parentElement as HTMLElement;
    const matrixInputs = within(matrixSection).getAllByRole('spinbutton');

    const values = ['2', '1', '1', '3'];
    for (let i = 0; i < matrixInputs.length; i += 1) {
      await userEvent.clear(matrixInputs[i]);
      await userEvent.type(matrixInputs[i], values[i]);
    }

    await userEvent.clear(screen.getByLabelText('b1'));
    await userEvent.type(screen.getByLabelText('b1'), '5');
    await userEvent.clear(screen.getByLabelText('b2'));
    await userEvent.type(screen.getByLabelText('b2'), '6');

    await userEvent.click(screen.getByRole('button', { name: /solve/i }));

    const solution = await screen.findByText(/Solution:/i);
    expect(solution.textContent).toContain('[1.800000, 1.400000]');
  });
});
