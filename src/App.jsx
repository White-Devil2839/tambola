import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentNumber, setCurrentNumber] = useState(null)
  const [calledNumbers, setCalledNumbers] = useState([])
  const [availableNumbers, setAvailableNumbers] = useState(Array.from({ length: 90 }, (_, i) => i + 1))
  const [showHistory, setShowHistory] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)

  const speakNumber = (number) => {
    if (speechEnabled && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Handle single digit numbers
      if (number < 10) {
        const utterance = new SpeechSynthesisUtterance(number.toString())
        utterance.rate = 0.8
        window.speechSynthesis.speak(utterance)
        return
      }

      // For double digit numbers
      const numStr = number.toString()
      const digits = numStr.split('')
      
      // Create speech sequence
      const speechSequence = [
        // Say each digit
        ...digits.map(digit => {
          const utterance = new SpeechSynthesisUtterance(digit)
          utterance.rate = 0.7 // Slightly slower rate for clarity
          return utterance
        }),
        // Say the full number
        new SpeechSynthesisUtterance(number.toString())
      ]

      // Add a small delay between utterances
      let delay = 0
      speechSequence.forEach((utterance, index) => {
        setTimeout(() => {
          window.speechSynthesis.speak(utterance)
        }, delay)
        delay += 500 // 500ms delay between each utterance
      })
    }
  }

  const generateNumber = () => {
    if (availableNumbers.length === 0) {
      alert('All numbers have been called!')
      return
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length)
    const newNumber = availableNumbers[randomIndex]
    
    setCurrentNumber(newNumber)
    setCalledNumbers([...calledNumbers, newNumber])
    setAvailableNumbers(availableNumbers.filter((_, index) => index !== randomIndex))
    speakNumber(newNumber)
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled)
  }

  return (
    <div className="housie-container">
      <h1>Housie Number Generator</h1>
      
      <div className="controls">
        <button 
          className="generate-btn"
          onClick={generateNumber}
          disabled={availableNumbers.length === 0}
        >
          Generate Number
        </button>
        
        <button 
          className="history-btn"
          onClick={toggleHistory}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>

        <button 
          className="speech-btn"
          onClick={toggleSpeech}
        >
          {speechEnabled ? 'Disable Speech' : 'Enable Speech'}
        </button>
      </div>

      {currentNumber && (
        <div className="current-number">
          <h2>Current Number: {currentNumber}</h2>
        </div>
      )}

      <div className="stats">
        <p>Numbers Called: {calledNumbers.length}/90</p>
        <p>Numbers Remaining: {availableNumbers.length}</p>
      </div>

      {showHistory && (
        <div className="history">
          <h3>Called Numbers History</h3>
          <div className="history-grid">
            {calledNumbers.map((number, index) => (
              <div key={index} className="history-number">
                {index + 1}. {number}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
