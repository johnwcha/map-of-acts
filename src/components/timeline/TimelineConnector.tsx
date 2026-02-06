interface TimelineConnectorProps {
  isLast?: boolean;
}

const TimelineConnector = ({ isLast = false }: TimelineConnectorProps) => {
  return (
    <div className="flex flex-col items-center">
      {/* Dot */}
      <div className="bg-primary size-4 rounded-full border-4 border-primary/20 ring-4 ring-white dark:ring-background-dark z-10 mt-6" />

      {/* Line */}
      {!isLast && (
        <div className="w-[2px] bg-primary/30 h-full -mt-2" />
      )}

      {/* Gradient fade for last item */}
      {isLast && (
        <div className="w-[2px] bg-gradient-to-b from-primary/30 to-transparent h-20 -mt-2" />
      )}
    </div>
  );
};

export default TimelineConnector;
