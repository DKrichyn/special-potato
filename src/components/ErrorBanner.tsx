interface ErrorBannerProps {
  message?: string;
}

export const ErrorBanner = ({ message }: ErrorBannerProps) => {
  if (!message) return null;
  return (
    <div className="card" role="alert" style={{ borderLeft: '4px solid #dc2626' }}>
      <strong>Error: </strong>
      {message}
    </div>
  );
};
