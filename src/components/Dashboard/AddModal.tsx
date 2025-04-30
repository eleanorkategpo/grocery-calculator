import {
  Box,
  Stack,
  styled,
  TextField,
  Typography,
  Button,
  Modal,
  IconButton,
  InputLabel,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  Divider,
} from "@mui/material";
import UserStore from "../../store/UserStore";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyInput from "react-currency-input-field";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import axios from "axios";
import { useRef, useState } from "react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import { enqueueSnackbar } from "notistack";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const BoxStyled = styled(Box)(() => ({
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "center",
  margin: "0 auto",
  width: "90%",
  maxWidth: 500,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "fit-content",
}));

const AddModal = () => {
  const userStore = UserStore();
  const priceInputRef = useRef<HTMLInputElement>(null);
  const { groceryId } = useParams();
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(userStore.editItem);
  
  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    barcode: Yup.string().required("Barcode is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Quantity must be positive")
      .integer("Quantity must be an integer"),
    unit: Yup.string().required("Unit is required"),
  });

  const handleClose = () => {
    userStore.setOpenAddModal(false);
    userStore.setEditItem(null);
  };

  const randomizeBarcode = (
    setFieldValue?: (field: string, value: any) => void
  ) => {
    const value = "BARCODE-" + Math.random().toString(36).substring(2, 6);
    if (setFieldValue) {
      setFieldValue("barcode", value);
    } else {
      return value;
    }
  };

  const handleSubmit = (values: any) => {
    const body = {
      ...values,
      groceryId: groceryId,
      total: Number(values.price) * Number(values.quantity),
    };
    setLoading(true);
    
    if (isEditMode) {
      // Update existing item
      axios
        .patch(`${API_URL}/grocery/item/${userStore.editItem?._id}`, body)
        .then((res) => {
          console.log("Update response:", res.data);
          if (res.status === 200) {
            enqueueSnackbar("Item updated successfully", {
              variant: "success",
            });
            
            if (userStore.groceryData) {
              // Create a new array with the updated item
              const updatedItems = userStore.groceryData.items.map(item => {
                if (item._id === userStore.editItem?._id) {
                  console.log("Replacing item:", item, "with:", res.data.data.groceryItem);
                  return res.data.data.groceryItem;
                }
                return item;
              });
              
              // Update grocery data with new items array
              userStore.setGroceryData({
                ...userStore.groceryData,
                items: updatedItems,
              });
            }
            
            // Close modal after state is updated
            handleClose();
          }
        })
        .catch((err) => {
          enqueueSnackbar(err.response?.data?.message || "Failed to update item", {
            variant: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Create new item
      axios
        .post(`${API_URL}/grocery/new-item`, body)
        .then((res) => {
          if (res.status === 201) {
            enqueueSnackbar("Item added successfully", {
              variant: "success",
            });
            handleClose();
            if (userStore.groceryData) {
              userStore.setGroceryData({
                ...userStore.groceryData,
                items: [
                  ...userStore.groceryData.items,
                  res.data.data.groceryItem,
                ],
              });
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(err.response?.data?.message || "Failed to add item", {
            variant: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  return (
    <Modal open={userStore.openAddModal} onClose={handleClose}>
      <BoxStyled>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          width="100%"
          sx={{
            position: "absolute",
            top: 0,
            zIndex: 1000,
            padding: 2,
            height: 50,
          }}
        >
          <Typography variant="h6">{isEditMode ? 'Edit Item' : 'Add Item'}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon color="secondary" />
          </IconButton>
        </Stack>
        <Box sx={{ overflow: "auto", paddingTop: "40px", width: "100%" }}>
          {/* <Typography component="span">Scan Barcode</Typography>
          <OCRCamera /> */}

          <Formik
            initialValues={isEditMode ? {
              barcode: userStore.editItem?.barcode || '',
              description: userStore.editItem?.description || '',
              price: userStore.editItem?.price.toString() || '0.00',
              quantity: userStore.editItem?.quantity || 1,
              unit: userStore.editItem?.unit || 'pc',
              total: userStore.editItem?.total.toString() || '0.00',
            } : {
              barcode: randomizeBarcode(),
              description: "",
              price: "0.00",
              quantity: 1,
              unit: "pc",
              total: "0.00",
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              // Handle form submission
              handleSubmit(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <Form>
                <Stack direction="column" spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <InputLabel>Barcode</InputLabel>
                    <Tooltip title="Randomize Barcode">
                      <IconButton
                        onClick={() => randomizeBarcode(setFieldValue)}
                        sx={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                          borderRadius: 10,
                          padding: 1,
                        }}
                      >
                        <ShuffleIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <TextField
                    name="barcode"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.barcode}
                    error={touched.barcode && Boolean(errors.barcode)}
                    helperText={touched.barcode && errors.barcode}
                  />
                  <InputLabel>Item Description</InputLabel>

                  <TextField
                    name="description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <InputLabel>Price</InputLabel>
                  <CurrencyInput
                    name="price"
                    decimalScale={2}
                    fixedDecimalLength={2}
                    onValueChange={(value) => {
                      setFieldValue("price", value);
                    }}
                    className="number-font"
                    onBlur={handleBlur}
                    value={values.price}
                    prefix="₱ "
                    style={{
                      width: "100%",
                      margin: "normal",
                      height: 50,
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                      fontSize: 20,
                      fontWeight: 600,
                      color: "var(--neon-green)",
                      padding: "0 10px",
                      background: "black",
                    }}
                    onFocus={() => {
                      if (priceInputRef.current) {
                        priceInputRef.current.select();
                      }
                    }}
                    ref={priceInputRef}
                  />
                  <InputLabel>Quantity</InputLabel>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    marginY={2}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => {
                        if (values.quantity > 1) {
                          setFieldValue("quantity", values.quantity - 1);
                        }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      name="quantity"
                      type="number"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.quantity}
                      error={touched.quantity && Boolean(errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                      inputProps={{ min: 1 }}
                      sx={{
                        flex: 1,
                        minWidth: { xs: 100, md: 150 },
                        input: { textAlign: "center" },
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setFieldValue("quantity", values.quantity + 1);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                    <FormControl variant="outlined" fullWidth margin="normal">
                      <InputLabel id="unit-label">Unit</InputLabel>
                      <Select
                        labelId="unit-label"
                        name="unit"
                        value={values.unit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.unit && Boolean(errors.unit)}
                        variant="filled"
                      >
                        <MenuItem value="kg">kg</MenuItem>
                        <MenuItem value="pc">pc</MenuItem>
                        <MenuItem value="g">g</MenuItem>
                        <MenuItem value="lb">lb</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Divider sx={{ backgroundColor: "var(--secondary-color)" }} />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <InputLabel>Total Price</InputLabel>
                      <Typography variant="h4">
                        {" "}
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "PHP",
                        }).format(
                          Number(values.price) * Number(values.quantity)
                        )}
                      </Typography>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isValid || loading}
                      color="primary"
                      size="large"
                      sx={{
                        borderRadius: 10,
                        padding: 2,
                      }}
                    >
                      {isEditMode ? <EditIcon /> : <AddShoppingCartIcon />}
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </BoxStyled>
    </Modal>
  );
};

export default AddModal;
