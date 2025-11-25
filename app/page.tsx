import { Brush, Category, Image } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Annotatify
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Annotate images with precision, organize with categories, and manage
          everything in one place
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Category sx={{ fontSize: 48, mb: 2, color: "primary.main" }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Categories
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organize your images by creating and managing categories. Easily
                create, update, and delete categories to keep everything
                organized.
              </Typography>
            </CardContent>
            <CardActions>
              <Link
                href="/categories"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Button size="large" fullWidth variant="outlined">
                  Manage Categories
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Brush sx={{ fontSize: 48, mb: 2, color: "primary.main" }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Annotations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Draw rectangles on images to highlight areas of interest. Choose
                colors and manage annotations with ease.
              </Typography>
            </CardContent>
            <CardActions>
              <Link
                href="/images"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Button size="large" fullWidth variant="outlined">
                  Get Started
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
