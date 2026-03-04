import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { MemoryCard } from './MemoryCard';
import { MemoryCardItem } from './utils';

type MemoryBoardProps = {
  cards: MemoryCardItem[];
  pairs: number;
  onCardPress: (cardId: string) => void;
  disabled?: boolean;
};

export const MemoryBoard = ({ cards, pairs, onCardPress, disabled }: MemoryBoardProps) => {
  const { width } = useWindowDimensions();
  const numColumns = pairs >= 8 ? 4 : 3;
  const gap = 10;
  const outerPadding = 12;
  const boardWidth = Math.min(width - 24, 430);
  const cardSize = Math.floor((boardWidth - outerPadding * 2 - gap * (numColumns - 1)) / numColumns);

  const rows = useMemo(() => {
    const grouped: MemoryCardItem[][] = [];
    for (let i = 0; i < cards.length; i += numColumns) {
      grouped.push(cards.slice(i, i + numColumns));
    }
    return grouped;
  }, [cards, numColumns]);

  return (
    <View style={[styles.board, { width: boardWidth, padding: outerPadding }]}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={[styles.row, rowIndex < rows.length - 1 ? { marginBottom: gap } : null]}>
          {row.map((card, index) => (
            <View key={card.id} style={index < row.length - 1 ? { marginRight: gap } : null}>
              <MemoryCard
                card={card}
                size={cardSize}
                onPress={() => onCardPress(card.id)}
                disabled={disabled}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.18)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
