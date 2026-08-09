package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.model.CatalogProduct
import com.example.ui.KameloUiState
import com.example.ui.KameloViewModel
import com.example.ui.theme.*

@Composable
fun CatalogoScreen(
    uiState: KameloUiState,
    onSelectProduct: (CatalogProduct) -> Unit,
    onSetViewGrid: (Boolean) -> Unit,
    onOpenNewProductDialog: () -> Unit,
    onOpenWhatsAppShare: (CatalogProduct) -> Unit,
    onCategoryFilterChange: (String) -> Unit,
    onCollectionFilterChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val categories = listOf("Todas", "Velas", "Difusores", "Textil")
    val collections = listOf("Todas", "Botánica", "Esenciales", "Otoño/Invierno", "Textil Home")

    val filtered = uiState.catalogProducts.filter { p ->
        (uiState.catalogCategoryFilter == "Todas" || p.category == uiState.catalogCategoryFilter) &&
                (uiState.catalogCollectionFilter == "Todas" || p.collection == uiState.catalogCollectionFilter)
    }

    val selected = uiState.selectedCatalogProduct ?: uiState.catalogProducts.firstOrNull()

    Row(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Left Column: Catalog Catalog Grid / List
        Column(
            modifier = Modifier
                .weight(0.55f)
                .fillMaxHeight()
        ) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxSize()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    // Top Controls & Toggle
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "CATÁLOGO DE PRODUCTOS (${filtered.size})",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloEspresso
                        )

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // View Toggle Buttons (Grid / List)
                            IconButton(onClick = { onSetViewGrid(true) }) {
                                Icon(
                                    imageVector = Icons.Default.GridView,
                                    contentDescription = "Grid View",
                                    tint = if (uiState.catalogViewIsGrid) KameloAmber else Color.Gray
                                )
                            }
                            IconButton(onClick = { onSetViewGrid(false) }) {
                                Icon(
                                    imageVector = Icons.Default.FormatListBulleted,
                                    contentDescription = "List View",
                                    tint = if (!uiState.catalogViewIsGrid) KameloAmber else Color.Gray
                                )
                            }

                            Button(
                                onClick = onOpenNewProductDialog,
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = KameloEspresso,
                                    contentColor = Color.White
                                ),
                                shape = RoundedCornerShape(10.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Nuevo", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Filters row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        categories.forEach { cat ->
                            FilterChip(
                                selected = uiState.catalogCategoryFilter == cat,
                                onClick = { onCategoryFilterChange(cat) },
                                label = { Text(cat, fontSize = 11.sp) }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Main Grid or List
                    if (uiState.catalogViewIsGrid) {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(2),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            items(filtered, key = { it.id }) { product ->
                                val isSelected = selected?.id == product.id
                                CatalogProductCard(
                                    product = product,
                                    isSelected = isSelected,
                                    onClick = { onSelectProduct(product) }
                                )
                            }
                        }
                    } else {
                        LazyColumn(
                            verticalArrangement = Arrangement.spacedBy(10.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            items(filtered, key = { it.id }) { product ->
                                val isSelected = selected?.id == product.id
                                CatalogProductListItem(
                                    product = product,
                                    isSelected = isSelected,
                                    onClick = { onSelectProduct(product) }
                                )
                            }
                        }
                    }
                }
            }
        }

        // Right Column: Product Detail Sheet (Ficha de Producto)
        Column(
            modifier = Modifier
                .weight(0.45f)
                .fillMaxHeight()
        ) {
            if (selected != null) {
                CatalogProductDetailSheet(
                    product = selected,
                    onOpenWhatsAppShare = { onOpenWhatsAppShare(selected) }
                )
            } else {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Seleccioná un producto para ver la ficha completa", color = Color.Gray)
                }
            }
        }
    }
}

@Composable
private fun CatalogProductCard(
    product: CatalogProduct,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        color = if (isSelected) KameloCream else Color.White,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) KameloAmber else KameloMutedBorder
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column {
            Box {
                AsyncImage(
                    model = product.imageUrl,
                    contentDescription = product.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                        .clip(RoundedCornerShape(topStart = 14.dp, topEnd = 14.dp))
                )
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = KameloEspresso.copy(alpha = 0.85f),
                    modifier = Modifier
                        .padding(8.dp)
                        .align(Alignment.TopEnd)
                ) {
                    Text(
                        text = product.category,
                        fontSize = 9.sp,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = product.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = KameloEspresso,
                    maxLines = 1
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = product.shortDescription,
                    fontSize = 11.sp,
                    color = Color.Gray,
                    maxLines = 2,
                    lineHeight = 14.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Desde ${KameloViewModel.formatArs(product.startingPrice)}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = KameloAmber
                    )
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = KameloStatusGreenBg
                    ) {
                        Text(
                            text = product.status,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloStatusGreen,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CatalogProductListItem(
    product: CatalogProduct,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(12.dp),
        color = if (isSelected) KameloCream else Color.White,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) KameloAmber else KameloMutedBorder
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            AsyncImage(
                model = product.imageUrl,
                contentDescription = product.name,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(10.dp))
            )

            Column(modifier = Modifier.weight(1f)) {
                Text(text = product.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = KameloEspresso)
                Text(text = "${product.category} • Colección ${product.collection}", fontSize = 11.sp, color = Color.Gray)
            }

            Text(
                text = KameloViewModel.formatArs(product.startingPrice),
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                color = KameloAmber
            )
        }
    }
}

@Composable
private fun CatalogProductDetailSheet(
    product: CatalogProduct,
    onOpenWhatsAppShare: () -> Unit
) {
    var selectedSize by remember(product.id) { mutableStateOf(product.sizes.firstOrNull() ?: "200 g") }
    var selectedAroma by remember(product.id) { mutableStateOf(product.aromas.firstOrNull() ?: "Ámbar") }

    val currentPrice = product.sizePrices[selectedSize] ?: product.startingPrice

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
        modifier = Modifier.fillMaxSize()
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Gallery
            item {
                Box {
                    AsyncImage(
                        model = product.imageUrl,
                        contentDescription = product.name,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .clip(RoundedCornerShape(14.dp))
                    )
                }
            }

            // Title & Description
            item {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = product.name,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold,
                                color = KameloEspresso
                            )
                            Text(
                                text = "Categoría: ${product.category} | Colección: ${product.collection}",
                                fontSize = 12.sp,
                                color = Color.Gray
                            )
                        }

                        Text(
                            text = KameloViewModel.formatArs(currentPrice),
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloAmber
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = product.fullDescription,
                        fontSize = 13.sp,
                        color = KameloDarkCharcoal.copy(alpha = 0.85f),
                        lineHeight = 18.sp
                    )
                }
            }

            // Variant Selectors (Tamaños)
            item {
                Column {
                    Text(
                        text = "Tamaños disponibles:",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = KameloEspresso
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        product.sizes.forEach { size ->
                            val sizePrice = product.sizePrices[size] ?: product.startingPrice
                            FilterChip(
                                selected = size == selectedSize,
                                onClick = { selectedSize = size },
                                label = { Text("$size (${KameloViewModel.formatArs(sizePrice)})", fontSize = 11.sp) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = KameloEspresso,
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                    }
                }
            }

            // Variant Selectors (Aromas)
            item {
                Column {
                    Text(
                        text = "Aromas disponibles:",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = KameloEspresso
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        product.aromas.forEach { aroma ->
                            FilterChip(
                                selected = aroma == selectedAroma,
                                onClick = { selectedAroma = aroma },
                                label = { Text(aroma, fontSize = 11.sp) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = KameloAmber,
                                    selectedLabelColor = Color.White
                                )
                            )
                        }
                    }
                }
            }

            // WhatsApp Featured Action Button
            item {
                Spacer(modifier = Modifier.height(10.dp))
                Button(
                    onClick = onOpenWhatsAppShare,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF25D366),
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                ) {
                    Icon(imageVector = Icons.Default.Share, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Compartir por WhatsApp", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                }
            }
        }
    }
}
