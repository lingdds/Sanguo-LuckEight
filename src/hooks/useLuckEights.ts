import { useState, useEffect, useCallback } from 'react';
import { Card, Suit, Rank, GameState, GameStatus } from '../types';
import { createDeck, shuffle } from '../constants';
import confetti from 'canvas-confetti';

export const useLuckEights = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentSuit: null,
    currentRank: null,
    turn: 'player',
    winner: null,
    status: 'rules',
    isSuitPickerOpen: false,
  });

  const initGame = useCallback(() => {
    const fullDeck = shuffle(createDeck());
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Find a non-8 card for the start of discard pile
    let firstCardIndex = fullDeck.findIndex(c => c.rank !== '8');
    if (firstCardIndex === -1) firstCardIndex = 0;
    const firstCard = fullDeck.splice(firstCardIndex, 1)[0];

    setState({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile: [firstCard],
      currentSuit: firstCard.suit,
      currentRank: firstCard.rank,
      turn: 'player',
      winner: null,
      status: 'playing',
      isSuitPickerOpen: false,
    });
  }, []);

  const drawCard = (target: 'player' | 'ai') => {
    if (state.deck.length === 0) {
      // Skip turn if deck is empty
      setState(prev => ({ ...prev, turn: prev.turn === 'player' ? 'ai' : 'player' }));
      return;
    }

    const newDeck = [...state.deck];
    const drawnCard = newDeck.pop()!;

    setState(prev => ({
      ...prev,
      deck: newDeck,
      [target === 'player' ? 'playerHand' : 'aiHand']: [...prev[target === 'player' ? 'playerHand' : 'aiHand'], drawnCard],
      turn: prev.turn === 'player' ? 'ai' : 'player',
    }));
  };

  const playCard = (card: Card, target: 'player' | 'ai', chosenSuit?: Suit) => {
    const isEight = card.rank === '8';
    const canPlay = isEight || card.suit === state.currentSuit || card.rank === state.currentRank;

    if (!canPlay) return false;

    setState(prev => {
      const handKey = target === 'player' ? 'playerHand' : 'aiHand';
      const newHand = prev[handKey].filter(c => c.id !== card.id);
      const newDiscardPile = [...prev.discardPile, card];
      
      const nextTurn = isEight && !chosenSuit ? prev.turn : (prev.turn === 'player' ? 'ai' : 'player');
      const winner = newHand.length === 0 ? target : null;

      if (winner) {
        if (winner === 'player') confetti();
        return {
          ...prev,
          [handKey]: newHand,
          discardPile: newDiscardPile,
          currentSuit: isEight ? (chosenSuit || prev.currentSuit) : card.suit,
          currentRank: card.rank,
          winner,
          status: 'gameOver',
        };
      }

      return {
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        currentSuit: isEight ? (chosenSuit || prev.currentSuit) : card.suit,
        currentRank: card.rank,
        turn: nextTurn,
        isSuitPickerOpen: isEight && target === 'player' && !chosenSuit,
      };
    });

    return true;
  };

  const handleSuitSelection = (suit: Suit) => {
    setState(prev => ({
      ...prev,
      currentSuit: suit,
      isSuitPickerOpen: false,
      turn: 'ai',
    }));
  };

  // AI Logic
  useEffect(() => {
    if (state.status === 'playing' && state.turn === 'ai' && !state.winner) {
      const timer = setTimeout(() => {
        const validCards = state.aiHand.filter(c => 
          c.rank === '8' || c.suit === state.currentSuit || c.rank === state.currentRank
        );

        if (validCards.length > 0) {
          // AI Strategy: Play 8 if it has many of a certain suit, or just play first valid
          const cardToPlay = validCards.find(c => c.rank === '8') || validCards[0];
          
          if (cardToPlay.rank === '8') {
            // AI chooses suit it has most of
            const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
            state.aiHand.forEach(c => { if(c.id !== cardToPlay.id) suitCounts[c.suit]++ });
            const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
            playCard(cardToPlay, 'ai', bestSuit);
          } else {
            playCard(cardToPlay, 'ai');
          }
        } else {
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status, state.aiHand, state.currentSuit, state.currentRank]);

  return {
    state,
    initGame,
    playCard,
    drawCard,
    handleSuitSelection,
  };
};
