import { render, screen } from "@testing-library/react";
import BiddingHistoryTable from "../BiddingHistoryTable";
import "@testing-library/jest-dom";

test("BiddingHistoryTable with no records", () => {
  render(<BiddingHistoryTable biddingHistory={[]} />);
  expect(screen.getByText("No bid history yet.")).toBeInTheDocument();
});
