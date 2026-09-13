import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  values: number[];
};

const CHART_HEIGHT = 132;
const PAD_X = 10;
const PAD_Y = 14;
const DAY_LABELS = ['−6d', '−5d', '−4d', '−3d', '−2d', '−1d', 'Filed'];

/** A hand-drawn SVG line over an invented 7-point index. Not market prices. */
export function MockActivityChart({ values }: Props) {
  const { width: windowWidth } = useWindowDimensions();
  // Start from the expected width (screen minus screen + card padding) so the chart draws on the
  // first frame; onLayout then corrects it to the exact measured width.
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const width = measuredWidth || Math.max(windowWidth - (spacing.lg + spacing.md) * 2, 0);

  const onLayout = (event: LayoutChangeEvent) => setMeasuredWidth(event.nativeEvent.layout.width);

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = values.length > 1 ? (width - PAD_X * 2) / (values.length - 1) : 0;

  const points = values.map((value, index) => ({
    x: PAD_X + index * stepX,
    y: PAD_Y + (1 - (value - min) / range) * (CHART_HEIGHT - PAD_Y * 2),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath =
    points.length > 0
      ? `${linePath} L${points[points.length - 1].x.toFixed(1)},${CHART_HEIGHT} L${points[0].x.toFixed(1)},${CHART_HEIGHT} Z`
      : '';

  const first = values[0];
  const last = values[values.length - 1];
  const endPoint = points[points.length - 1];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Mock 7-day activity</Text>
        <Text style={styles.tag}>DEMO INDEX</Text>
      </View>
      <Text style={styles.subtitle}>Invented activity points for illustration — not live market information.</Text>

      <View
        onLayout={onLayout}
        style={styles.plot}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Mock 7-day activity chart. Fictional index moves from ${first} to ${last}.`}
      >
        {width > 0 && (
          <Svg width={width} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.analytics} stopOpacity={0.35} />
                <Stop offset="1" stopColor={colors.analytics} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {[0.25, 0.5, 0.75].map((fraction) => (
              <Line
                key={fraction}
                x1={0}
                x2={width}
                y1={CHART_HEIGHT * fraction}
                y2={CHART_HEIGHT * fraction}
                stroke={colors.border}
                strokeDasharray="4 6"
                strokeWidth={1}
              />
            ))}
            <Path d={areaPath} fill="url(#area)" />
            <Path d={linePath} stroke={colors.analytics} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
            {points.slice(0, -1).map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r={3} fill={colors.background} stroke={colors.analytics} strokeWidth={2} />
            ))}
            {endPoint && <Circle cx={endPoint.x} cy={endPoint.y} r={5.5} fill={colors.accent} stroke={colors.text} strokeWidth={2} />}
          </Svg>
        )}
      </View>

      <View style={styles.labels}>
        {DAY_LABELS.map((label) => (
          <Text key={label} style={styles.dayLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  tag: {
    color: colors.demo,
    backgroundColor: colors.demoSoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  plot: {
    height: CHART_HEIGHT,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  dayLabel: {
    color: colors.textMuted,
    fontSize: 11,
    width: 36,
    textAlign: 'center',
  },
});
