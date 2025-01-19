import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const RiskRewardCalculator = () => {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    entryPrice: '',
    stopLoss: '',
    targetPrice: '',
    quantity: ''
  });

  const calculateRiskReward = (entry, stop, target) => {
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    return (reward / risk).toFixed(2);
  };

  const calculateRiskAmount = (entry, stop, quantity) => {
    return Math.abs(entry - stop) * quantity;
  };

  const calculateRewardAmount = (entry, target, quantity) => {
    return Math.abs(target - entry) * quantity;
  };

  const calculateRiskPercentage = (entry, stop) => {
    return ((Math.abs(entry - stop) / entry) * 100).toFixed(2);
  };

  const calculateRewardPercentage = (entry, target) => {
    return ((Math.abs(target - entry) / entry) * 100).toFixed(2);
  };

  const formatIndianRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPosition(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPosition = () => {
    if (!newPosition.symbol || !newPosition.entryPrice || !newPosition.stopLoss || 
        !newPosition.targetPrice || !newPosition.quantity) {
      return;
    }

    const entry = parseFloat(newPosition.entryPrice);
    const stop = parseFloat(newPosition.stopLoss);
    const target = parseFloat(newPosition.targetPrice);
    const quantity = parseInt(newPosition.quantity);

    const position = {
      ...newPosition,
      riskReward: calculateRiskReward(entry, stop, target),
      riskPercentage: calculateRiskPercentage(entry, stop),
      rewardPercentage: calculateRewardPercentage(entry, target),
      riskAmount: calculateRiskAmount(entry, stop, quantity),
      rewardAmount: calculateRewardAmount(entry, target, quantity)
    };

    setPositions(prev => [...prev, position]);
    setNewPosition({
      symbol: '',
      entryPrice: '',
      stopLoss: '',
      targetPrice: '',
      quantity: ''
    });
  };

  const handleDelete = (index) => {
    setPositions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Stock Trading Risk/Reward Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6 flex-wrap">
          <Input
            placeholder="Symbol"
            name="symbol"
            value={newPosition.symbol}
            onChange={handleInputChange}
            className="w-24"
          />
          <Input
            placeholder="Quantity"
            name="quantity"
            type="number"
            min="1"
            value={newPosition.quantity}
            onChange={handleInputChange}
            className="w-28"
          />
          <Input
            placeholder="Entry Price (₹)"
            name="entryPrice"
            type="number"
            step="0.01"
            value={newPosition.entryPrice}
            onChange={handleInputChange}
            className="w-32"
          />
          <Input
            placeholder="Stop Loss (₹)"
            name="stopLoss"
            type="number"
            step="0.01"
            value={newPosition.stopLoss}
            onChange={handleInputChange}
            className="w-32"
          />
          <Input
            placeholder="Target Price (₹)"
            name="targetPrice"
            type="number"
            step="0.01"
            value={newPosition.targetPrice}
            onChange={handleInputChange}
            className="w-32"
          />
          <Button onClick={handleAddPosition}>Add Position</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Entry Price</th>
                <th className="px-4 py-2 text-left">Stop Loss</th>
                <th className="px-4 py-2 text-left">Target Price</th>
                <th className="px-4 py-2 text-left">Risk Amount</th>
                <th className="px-4 py-2 text-left">Reward Amount</th>
                <th className="px-4 py-2 text-left">R:R</th>
                <th className="px-4 py-2 text-left">Risk %</th>
                <th className="px-4 py-2 text-left">Reward %</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{position.symbol}</td>
                  <td className="px-4 py-2">{position.quantity}</td>
                  <td className="px-4 py-2">{formatIndianRupees(position.entryPrice)}</td>
                  <td className="px-4 py-2">{formatIndianRupees(position.stopLoss)}</td>
                  <td className="px-4 py-2">{formatIndianRupees(position.targetPrice)}</td>
                  <td className="px-4 py-2">{formatIndianRupees(position.riskAmount)}</td>
                  <td className="px-4 py-2">{formatIndianRupees(position.rewardAmount)}</td>
                  <td className="px-4 py-2">1:{position.riskReward}</td>
                  <td className="px-4 py-2">{position.riskPercentage}%</td>
                  <td className="px-4 py-2">{position.rewardPercentage}%</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskRewardCalculator;
