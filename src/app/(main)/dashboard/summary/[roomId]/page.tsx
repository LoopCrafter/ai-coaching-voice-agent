import React from "react";

const Summary = async ({ params }: { params: Promise<{ roomId: string }> }) => {
  const { roomId } = await params;
  return <div>Summary room {roomId}</div>;
};

export default Summary;
