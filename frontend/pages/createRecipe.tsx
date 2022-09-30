import { useAuthentication } from '@api/authentication';
import { useMutation, useQuery } from '@apollo/client';
import Layout from '@components/Layout';
import IngredientList from '@components/recipe/createRecipe/IngredientList';
import InstructionList from '@components/recipe/createRecipe/InstructionList';
import Restriction from '@components/Restriction';
import { CREATE_INGREDIENT, CREATE_RECIPE, UPLOAD_RECIPE_PICTURE } from '@graphql/mutations';
import { GET_CATEGORIES } from '@graphql/queries';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Alert, Autocomplete, Box, Card, Container, Snackbar, Stack, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSettings } from 'src/theme/settings';
import { CategoryProps } from 'src/types/category';

interface InstructionType {
    id: number;
    description: string;
}

interface IngredientType {
    id: number;
    name: string;
    amount?: number;
    unit?: string;
}

const CreateRecipePage = () => {
    // Get userDetails
    const { userDetails } = useAuthentication()
    // Get recipe categories
    const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES)

    // Store new recipe state
    const [instructionsState, setInstructionsState] = useState<InstructionType[]>([{ id: 0, description: "" }]);
    const [ingredientsState, setIngredientsState] = useState<IngredientType[]>([{ id: 0, name: "", amount: undefined, unit: "stk" }]);
    const [image, setImage] = useState();
    const [previewImage, setPreviewImage] = useState<any>()
    const [tabValue, setTabValue] = useState(0);

    // GraphQL mutations
    const [createRecipe] = useMutation(CREATE_RECIPE)
    const [createIngredient] = useMutation(CREATE_INGREDIENT)
    const [uploadImage] = useMutation(UPLOAD_RECIPE_PICTURE, {
        onError(err) {
            console.log(err);
        },
    })

    // Handle form-state with react-hook-forms (See react-hook-forms documentation)
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    // Function called when form is submitted
    const onSubmit = (data: any) => {
        if (!userDetails) return

        // Ugly mutation function calls
        createRecipe({
            variables: {
                profile: userDetails.profile.id,
                recipeData: {
                    name: data.name,
                    category: data.category.id,
                    timeEstimate: data.timeEstimate,
                    portionSize: data.portionSize,
                    instructions: instructionsState.map(item => item.description).join("\r\n") // Map instructionList to text
                }
            },
            onCompleted: data => { // When recipe has been created
                // Get ID from created recipe
                const recipeId = data.createRecipe.recipe.id
                if (image) {
                    // Fire image upload mutation if image exists
                    uploadImage({ variables: { file: image, id: recipeId } })
                }
                // Create an ingredient entity for every ingredient in list
                ingredientsState.forEach(ingredient => {
                    createIngredient({
                        variables: {
                            recipe: recipeId,
                            ingredientData: {
                                name: ingredient.name,
                                amount: ingredient.amount,
                                unit: ingredient.unit
                            }
                        }
                    })
                })
                setSnackbar(true)
            },
            refetchQueries: ["allRecipes"]
        })
    }

    // Update selected tab value
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Update image states on image change
    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.validity.valid) {
            // Get file from input field
            const [file]: any = e.target.files
            if (file) {
                // Set selected image state
                setImage(file)
                // Set preview image URL
                setPreviewImage(URL.createObjectURL(file))
            }
        }
    }

    if (!userDetails) {
        return (
            <>
                <Restriction />
            </>
        )
    }

    const { themeMode } = useSettings();

    const [snackbar, setSnackbar] = useState(false)

    const handleSnackbarClose = () => {
        setSnackbar(false)
    }

    return (
        <>
            <Snackbar
                open={snackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            >
                <Alert variant="filled" severity="success" onClose={handleSnackbarClose} sx={{ width: '300px' }}>
                    Oppskrift publisert
                </Alert>
            </Snackbar>
            <Container component='main' maxWidth='sm' >
                {/* Image upload */}
                <Card component="form" variant='outlined' sx={{
                    width: "100%",
                    height: 200,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundImage: previewImage ? `url(${previewImage})` : "none",
                    backgroundSize: "cover",
                    ...(!previewImage && { boxShadow: "none" })
                }}>
                    <label htmlFor="contained-button-file">
                        <input hidden accept="image/*" type='file' id="contained-button-file" onChange={onImageChange} />
                        <Button size="large" endIcon={<AddPhotoAlternateOutlinedIcon />} variant={previewImage ? "contained" : "outlined"} component="span" color="inherit" sx={{ ...(themeMode !== "dark" && { bgcolor: "common.white" }) }}>
                            Velg bilde
                        </Button>
                    </label>
                </Card>

                <Stack
                    pt={3}
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={3}
                >
                    {/* Name */}
                    <TextField fullWidth label="Navn på rett" variant="outlined" error={!!errors.name} {...register('name', { required: true })} />

                    {/* Time Estimate */}
                    <TextField fullWidth label="Tidsestimat" helperText="Format: hh:mm:ss" variant="outlined" error={!!errors.timeEstimate}
                        {...register('timeEstimate', { required: true })} />

                    {/* Controller is react-hook-forms way of getting Autocomplete component value */}
                    {categoriesData && !categoriesLoading && (
                        <Controller
                            name="category"
                            control={control}
                            defaultValue={{ "label": categoriesData.allCategories[0].name, "id": categoriesData.allCategories[0].id }}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Autocomplete
                                        disablePortal
                                        value={value}
                                        isOptionEqualToValue={(option, value) => option.id == value.id}
                                        onChange={(event, value) => onChange(value)}
                                        options={categoriesData.allCategories.map((category: CategoryProps) => (
                                            { "label": category.name, "id": category.id }
                                        ))}
                                        renderInput={(params) => <TextField {...params} error={!!errors.category} label="Kategori" />}
                                    />
                                </>
                            )}
                        />
                    )}

                    {/* Portion size */}
                    <TextField type="number" fullWidth label="Antall porsjoner" variant="outlined" error={!!errors.portionSize} {...register('portionSize', { required: true })} />

                    {/* Select instructionList og ingredientList editor */}
                    <div>
                        <Tabs
                            textColor="inherit"
                            indicatorColor="secondary"
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="basic tabs example"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab label="Fremgangsmåte" />
                            <Tab label="Ingredienser" />
                        </Tabs>

                        <TabPanel value={tabValue} index={0}>
                            <InstructionList state={instructionsState} setState={setInstructionsState} />
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <IngredientList state={ingredientsState} setState={setIngredientsState} />
                        </TabPanel>
                    </div>

                    <Button size="large" type="submit" fullWidth color="secondary" variant="contained">
                        Lag oppskrift
                    </Button>
                </Stack>
            </Container>
        </>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            sx={{ mt: 1.5 }}
            {...other}
        >
            {value === index && (
                <>
                    {children}
                </>
            )}
        </Box>
    );
}

CreateRecipePage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default CreateRecipePage;