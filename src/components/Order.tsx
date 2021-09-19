import React from 'react';

interface OrderProps {
  createdAt: string;
  destination: string;
  deliverRequest: string;
}

const Order: React.FC<OrderProps> = ({ createdAt, destination, deliverRequest, children: orderItems }) => {
  return (
    <div className="m-2 p-2">
      <h2 className="mb-2 font-bold text-lg">{createdAt}</h2>
      <div className="border-2 rounded-lg">{orderItems}</div>
    </div>
  );
};

export default Order;
