"use client"
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, MessageCircle, X, HeadphonesIcon, WatchIcon, LaptopIcon, ArrowLeft } from "lucide-react";
import { featuredProducts } from "@/data/products";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const getSystemMessage = (): OpenAI.Chat.ChatCompletionCreateParams['messages'][0] => ({
  role: "system",
  content: `You are a helpful e-commerce assistant. You have knowledge of these products:

  ${featuredProducts.map(p => `${p.name}: ${p.description} - Price: $${p.price}`).join('\n')}
  
  - If a user mentions any of these products, provide specific details about that product
  - If they ask about price, features, or comparisons between products, give accurate information
  - For general inquiries, provide helpful responses
  - If asked about products not in the list, politely explain you can only help with listed products
  - Keep responses concise and friendly`
});

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSupportMode, setIsSupportMode] = useState(false);

  const handleSupportMode = () => {
    setIsSupportMode(true);
    setMessages(prev => [...prev, {
      role: "system",
      content: "You're now connected to customer support. How can we help you today?"
    }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    const newMessage = { role: "user", content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const response = await openai.chat.completions.create({
        messages: [
          getSystemMessage(),
          ...(isSupportMode ? [{
            role: "system",
            content: "You are now acting as a customer support representative. Be extra helpful and professional."
          }] : []),
          ...messages,
          newMessage
        ],
        model: "gpt-3.5-turbo",
      });
      
      setMessages(prev => [...prev, response.choices[0].message]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[350px] h-[500px] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setMessages([]);
                    setIsSupportMode(false);
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="font-semibold">
                {isSupportMode ? "Customer Support" : "Product Assistant"}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block p-3 rounded-lg ${
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            {!isSupportMode && messages.length === 0 && (
              <Button
                variant="secondary"
                onClick={handleSupportMode}
                className="w-full mb-4"
              >
                Contact Customer Support
              </Button>
            )}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isSupportMode ? "Type your support query..." : "Ask about our products..."}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button onClick={() => setIsOpen(true)} size="icon">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}