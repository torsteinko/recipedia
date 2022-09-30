import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/router';
import * as React from 'react';
import Routes from 'src/routes';


export default function RecipediaBottomNavigation() {
    const router = useRouter();

    return (

        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, borderTop: 1, borderColor: "divider", }} elevation={20}>
            <BottomNavigation
                value={router.pathname}
            >
                <BottomNavigationAction label="Hjem"
                    icon={<HomeIcon />}
                    value={Routes.home}
                    onClick={() => router.push(Routes.home)}
                />
                <BottomNavigationAction label="Søk"
                    icon={<SearchIcon />}
                    value={Routes.search}
                    onClick={() => router.push(Routes.search)}
                />
                <BottomNavigationAction label="Opprett"
                    value={Routes.createRecipe}
                    onClick={() => router.push(Routes.createRecipe)}
                    icon={<AddIcon />} />
                <BottomNavigationAction label="Favoritter"
                    value={Routes.likedRecipes}
                    onClick={() => router.push(Routes.likedRecipes)}
                    icon={<FavoriteIcon />}
                />
                <BottomNavigationAction label="Profil"
                    icon={<AccountCircleIcon />}
                    value={Routes.profile}
                    onClick={() => router.push(Routes.profile)}
                />
            </BottomNavigation>
        </Paper>
    );
}
