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
} from "@mui/material";
import UserStore from "../../store/UserStore";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyInput from "react-currency-input-field";
import OCRCamera from "../shared/OCRCamera";

const BoxStyled = styled(Box)(() => ({
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  width: "90%",
  maxWidth: 500,
  height: "100%",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

}));

const AddModal = () => {
  const userStore = UserStore();

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
  });

  const handleBarcodeClick = () => {
    console.log("Barcode clicked");
  };

  const handleClose = () => {
    userStore.setOpenAddModal(false);
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
            backgroundColor: "white",
            padding: 2,
            height: 50,
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon color="secondary" />
          </IconButton>
        </Stack>
        <Box sx={{overflow: "auto", paddingTop: "60px"}}>
          <Typography component="span">Scan Barcode</Typography>
          <OCRCamera />

          <Formik
            initialValues={{
              barcode: userStore.barcode || "",
              description: "",
              price: "0.00",
              quantity: 1,
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              // Handle form submission
              console.log("Form values:", values);
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
                <Stack direction="column" spacing={2} mt={2}>
                  <InputLabel>Barcode</InputLabel>
                  <TextField
                    name="barcode"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.barcode}
                    error={touched.barcode && Boolean(errors.barcode)}
                    onClick={handleBarcodeClick}
                    helperText={touched.barcode && errors.barcode}
                    disabled={true}
                  />
                  <InputLabel>Item Description</InputLabel>

                  <TextField
                    label="Name"
                    name="name"
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
                      color: "var(--text-color)",
                      padding: "0 10px",
                      background: "black"
                    }}
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
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setFieldValue("quantity", values.quantity + 1);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    pt={4}
                    justifyContent="center"
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isValid}
                      color="primary"
                      size="large"
                    >
                      <AddIcon /> Add to Cart
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
