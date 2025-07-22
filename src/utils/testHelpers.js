// Test utility to simulate vehicle images response
export const testVehicleImagesResponse = {
  "response": "Here are the images for the 2023 Toyota Aqua G Grade (Stock No. 70211):\n\n1) /uploads/Toyota-Aqua.jpeg\n\nLet me know if you'd like more photos or details—Happy to help! 🚗",
  "car_data": [],
  "vehicle_images": [
    "/uploads/Toyota-Aqua.jpeg",
    "/uploads/Toyota-Aqua-2.jpeg",
    "/uploads/Toyota-Aqua-3.jpeg"
  ]
}

// Function to add test message with vehicle images to chat
export const addTestVehicleImagesMessage = (sendMessage) => {
  // Simulate receiving a response with vehicle images
  const mockMessage = {
    id: Date.now(),
    type: 'bot',
    content: testVehicleImagesResponse.response,
    isStreaming: false,
    carData: testVehicleImagesResponse.car_data,
    vehicleImages: testVehicleImagesResponse.vehicle_images,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  return mockMessage;
}
