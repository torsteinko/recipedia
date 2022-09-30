import { Box, Stack, Typography } from "@mui/material"

const Restriction = () => {
    return (
        <Box position="absolute" display="flex" justifyContent="center" alignItems="center" sx={{ height: "80%", width: "100%" }}>
            <Stack spacing={2} alignItems="center">
                <Typography variant="h2">
                    Du må logge inn <br />for å få tilgang her!
                </Typography>
            </Stack>
        </Box>
    )
}

export default Restriction