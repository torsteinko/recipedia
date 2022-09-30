import { useAuthentication } from '@api/authentication';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import IngredientList from '@components/recipe/createRecipe/IngredientList';
import InstructionList from '@components/recipe/createRecipe/InstructionList';
import { CREATE_INGREDIENT, DELETE_INGREDIENT, UPDATE_RECIPE, UPLOAD_RECIPE_PICTURE } from '@graphql/mutations';
import { GET_CATEGORIES, GET_RECIPES } from '@graphql/queries';
import { Close } from '@mui/icons-material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Autocomplete, Box, Button, Card, Container, Fab, Modal, Paper, Slide, Stack, Tab, Tabs, TextField } from "@mui/material";
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSettings } from 'src/theme/settings';
import { CategoryProps } from 'src/types/category';
import { RecipeProps } from "src/types/recipe";
import parseDurationHH_MM_SS from 'src/utils/parseDurationHH_MM_SS';

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

interface EditRecipeProps {
    recipe: RecipeProps;
    edit: boolean;
    setEdit: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

const createInstructionListFromText = (instructionText: string) => {
    const instructionList = instructionText.split("\r\n")
    let result = []
    for (let i = 0; i < instructionList.length; i++) {
        result.push({ id: i, description: instructionList[i] })
    }
    return result
}


const EditRecipe = ({ recipe, edit, setEdit }: EditRecipeProps) => {
    const handleClose = () => setEdit(false);
    const { themeMode } = useSettings()

    // Get userDetails
    const { userDetails } = useAuthentication()
    // Get recipe categories
    const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES)

    // Store new recipe state
    // Note that the instructionsState and ingredientsState start with the values from recipe
    const [instructionsState, setInstructionsState] = useState<InstructionType[]>(createInstructionListFromText(recipe.instructions));
    const [ingredientsState, setIngredientsState] = useState<IngredientType[]>(recipe.ingredients.map(item => { return { id: item.id, name: item.name, amount: item.amount, unit: item.unit } }));
    const [image, setImage] = useState();
    const [previewImage, setPreviewImage] = useState<any>()
    const [tabValue, setTabValue] = useState(0);

    // GraphQL mutations
    const [updateRecipe] = useMutation(UPDATE_RECIPE)
    const [createIngredient] = useMutation(CREATE_INGREDIENT)
    const [deleteIngredient] = useMutation(DELETE_INGREDIENT)
    const [getRecipes, { data: recipesData }] = useLazyQuery(GET_RECIPES)
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

        if (image) {
            // Fire image upload mutation if image exists
            uploadImage({ variables: { file: image, id: recipe.id } })
        }
        // Delete previous ingredients
        for (let ingredient of recipe.ingredients) {
            deleteIngredient({
                variables: {
                    id: ingredient.id
                }
            })
        }
        // Create an ingredient entity for every ingredient in list
        ingredientsState.forEach(ingredient => {
            createIngredient({
                variables: {
                    recipe: recipe.id,
                    ingredientData: {
                        name: ingredient.name,
                        amount: ingredient.amount,
                        unit: ingredient.unit
                    }
                },
            })
        })

        // This has to come last becuase we call refetch queries here
        updateRecipe({
            variables: {
                id: recipe.id,
                recipeData: {
                    name: data.name,
                    category: data.category.id,
                    timeEstimate: data.timeEstimate,
                    portionSize: data.portionSize,
                    instructions: instructionsState.map(item => item.description).join("\r\n") // Map instructionList to text
                }
            },
            update: (cache) => {
                console.log(cache)
            }
        })
        setEdit(false);
        getRecipes()
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

    return (
        <Modal
            open={edit}
            onClose={handleClose}
            hideBackdrop
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
        >
            <Slide in={edit} direction='up'>
                <Box component={Paper} sx={{
                    position: 'absolute',
                    height: "100vh",
                    overflowY: "scroll",
                    top: 0,
                    left: 0,
                    width: "100%",
                    py: 5
                }}>
                    <Fab onClick={handleClose} sx={{ position: "absolute", top: 0, right: 0, m: 2, zIndex: 2000, color: "common.white" }} size="large">
                        <Close fontSize="large" />
                    </Fab>
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
                            <TextField defaultValue={recipe.name} fullWidth label="Navn på rett" variant="outlined" error={!!errors.name} {...register('name', { required: true })} />

                            {/* Time Estimate */}
                            <TextField defaultValue={parseDurationHH_MM_SS(recipe.timeEstimate)} fullWidth label="Tidsestimat" helperText="Format: hh:mm:ss" variant="outlined" error={!!errors.timeEstimate}
                                {...register('timeEstimate', { required: true })} />

                            {/* Controller is react-hook-forms way of getting Autocomplete component value */}
                            {categoriesData && !categoriesLoading && (
                                <Controller
                                    name="category"
                                    control={control}
                                    defaultValue={{ "label": recipe.category.name, "id": recipe.category.id }}
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
                            <TextField defaultValue={recipe.portionSize} type="number" fullWidth label="Antall porsjoner" variant="outlined" error={!!errors.portionSize} {...register('portionSize', { required: true })} />

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
                                Oppdater oppskrift
                            </Button>
                        </Stack>
                    </Container>
                </Box>
            </Slide>
        </Modal>
    );
}


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}


const TabPanel = (props: TabPanelProps) => {
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


export default EditRecipe;