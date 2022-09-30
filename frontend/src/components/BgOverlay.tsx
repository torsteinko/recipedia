// @mui
import { Box, BoxProps, NoSsr } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import cssStyles from '../utils/cssStyles';

// ----------------------------------------------------------------------

interface BackgroundOverlayProps extends BoxProps {
    direction?: string;
    startColor?: string;
    endColor?: string;
}

const RootStyle = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'direction' && prop !== 'startColor' && prop !== 'endColor',
})<BackgroundOverlayProps>(({ direction, startColor, endColor, theme }) => ({
    top: 0,
    left: 0,
    zIndex: 8,
    width: '100%',
    height: '100%',
    position: 'absolute',
    ...cssStyles(theme).bgGradient({ direction, startColor, endColor }),
}));

// ----------------------------------------------------------------------

export default function BgOverlay({
    direction,
    startColor,
    endColor,
    ...other
}: BackgroundOverlayProps) {
    return (
        <NoSsr>
            <RootStyle direction={direction} startColor={startColor} endColor={endColor} {...other} />
        </NoSsr>
    );
}