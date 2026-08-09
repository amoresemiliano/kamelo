package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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
import com.example.model.MarketBenchmark
import com.example.model.MarketProduct
import com.example.ui.KameloUiState
import com.example.ui.KameloViewModel
import com.example.ui.theme.*

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun MercadoScreen(
    uiState: KameloUiState,
    onConsultMarket: () -> Unit,
    onCategoryFilterChange: (String) -> Unit,
    onSizeFilterChange: (String) -> Unit,
    onAromaFilterChange: (String) -> Unit,
    onLocationFilterChange: (String) -> Unit,
    onSourceFilterChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val categories = listOf("Todas", "Velas", "Difusores", "Textil")
    val sizes = listOf("Todos", "200 g", "350 g", "500 g", "250 ml")
    val locations = listOf("Todas", "CABA", "Zona Norte GBA", "Buenos Aires", "Argentina")
    val sources = listOf("Todas", "Mercado Libre", "tiendas online", "marcas independientes", "ecommerce especializados")

    val filteredProducts = uiState.marketProducts.filter { p ->
        (uiState.marketCategoryFilter == "Todas" || p.category == uiState.marketCategoryFilter) &&
                (uiState.marketSizeFilter == "Todos" || p.size == uiState.marketSizeFilter) &&
                (uiState.marketLocationFilter == "Todas" || p.location == uiState.marketLocationFilter) &&
                (uiState.marketSourceFilter == "Todas" || p.source == uiState.marketSourceFilter)
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(20.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Header & Main Consult CTA
        item {
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = KameloCream,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Inteligencia de mercado",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloEspresso
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Seguí precios, productos y tendencias del mercado de velas y aromáticos.",
                            fontSize = 13.sp,
                            color = KameloDarkCharcoal.copy(alpha = 0.8f)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Última actualización: ${uiState.lastMarketUpdate}",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = KameloAmber
                        )
                    }

                    Button(
                        onClick = onConsultMarket,
                        enabled = !uiState.isConsultingMarket,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = KameloEspresso,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(14.dp),
                        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 14.dp)
                    ) {
                        if (uiState.isConsultingMarket) {
                            CircularProgressIndicator(
                                color = Color.White,
                                modifier = Modifier.size(18.dp),
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Consultando mercado...", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        } else {
                            Icon(imageVector = Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Consultar mercado", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // KPIs Cards Row
        item {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "MÉTRICAS CLAVE DEL SECTOR",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = KameloAmber
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    KpiCard("PRODUCTOS ENCONTRADOS", "146", "Relevados", Modifier.weight(1f))
                    KpiCard("PRECIO PROMEDIO", "$23.850", "Sector velas/difusores", Modifier.weight(1f))
                    KpiCard("PRECIO MÍNIMO", "$9.900", "Insumos menores", Modifier.weight(1f))
                    KpiCard("PRECIO MÁXIMO", "$58.000", "Ediciones Luxury", Modifier.weight(1f))
                    KpiCard("MEDIANA", "$22.500", "Punto de equilibrio", Modifier.weight(1f))
                }
            }
        }

        // KAMELO VS MERCADO Comparison
        item {
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "KAMELO VS MERCADO (BENCHMARK DE PRECIOS)",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = KameloEspresso
                    )
                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        uiState.marketBenchmarks.forEach { bench ->
                            BenchmarkComparisonCard(bench, modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }

        // Filters Section
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "FILTRAR MUESTRAMIENTO DE MERCADO", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = KameloEspresso)
                    Spacer(modifier = Modifier.height(10.dp))

                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Category Filter Dropdown
                        FilterGroupLabel("Categoría:")
                        categories.forEach { cat ->
                            FilterChip(
                                selected = uiState.marketCategoryFilter == cat,
                                onClick = { onCategoryFilterChange(cat) },
                                label = { Text(cat, fontSize = 11.sp) }
                            )
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        FilterGroupLabel("Ubicación:")
                        locations.take(3).forEach { loc ->
                            FilterChip(
                                selected = uiState.marketLocationFilter == loc,
                                onClick = { onLocationFilterChange(loc) },
                                label = { Text(loc, fontSize = 11.sp) }
                            )
                        }
                    }
                }
            }
        }

        // Results Table Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "TABLA DE RESULTADOS DE MERCADO (${filteredProducts.size})",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = KameloEspresso
                )
                Text(
                    text = "Mostrando datos mock de Argentina",
                    fontSize = 11.sp,
                    color = Color.Gray
                )
            }
        }

        // Results Table Rows
        items(filteredProducts, key = { it.id }) { product ->
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = if (product.brand == "Kamelo") KameloCream else Color.White,
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (product.brand == "Kamelo") KameloAmber else KameloMutedBorder
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    AsyncImage(
                        model = product.imageUrl,
                        contentDescription = product.productName,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(50.dp)
                            .clip(RoundedCornerShape(10.dp))
                    )

                    Column(modifier = Modifier.weight(2f)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(
                                text = product.brand,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = if (product.brand == "Kamelo") KameloAmber else KameloEspresso
                            )
                            if (product.brand == "Kamelo") {
                                Surface(shape = RoundedCornerShape(6.dp), color = KameloEspresso) {
                                    Text("NUESTRO", fontSize = 9.sp, color = Color.White, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                                }
                            }
                        }
                        Text(text = product.productName, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                        Text(text = "${product.category} • ${product.size} • Aroma ${product.aroma}", fontSize = 11.sp, color = Color.Gray)
                    }

                    Column(modifier = Modifier.weight(1.5f)) {
                        Text(text = "Ubicación: ${product.location}", fontSize = 11.sp, color = Color.Gray)
                        Text(text = "Fuente: ${product.source}", fontSize = 11.sp, color = KameloDarkCharcoal)
                        Text(text = "Fecha: ${product.date}", fontSize = 10.sp, color = Color.LightGray)
                    }

                    Column(horizontalAlignment = Alignment.End, modifier = Modifier.weight(1.2f)) {
                        Text(
                            text = KameloViewModel.formatArs(product.price),
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = KameloEspresso
                        )
                        if (product.promoPrice != null) {
                            Text(
                                text = "Promo: ${KameloViewModel.formatArs(product.promoPrice)}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = KameloStatusGreen
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun KpiCard(
    label: String,
    value: String,
    subtext: String,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = Color.White,
        border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Text(text = label, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray, maxLines = 1)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = value, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = KameloEspresso)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = subtext, fontSize = 10.sp, color = KameloAmber)
        }
    }
}

@Composable
private fun BenchmarkComparisonCard(
    bench: MarketBenchmark,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = KameloLinen,
        border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = bench.title, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = KameloEspresso)
            Text(text = bench.sizeLabel, fontSize = 11.sp, color = Color.Gray)

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text("Kamelo", fontSize = 10.sp, color = Color.Gray)
                    Text(KameloViewModel.formatArs(bench.kameloPrice), fontWeight = FontWeight.Bold, fontSize = 14.sp, color = KameloEspresso)
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text("Promedio mercado", fontSize = 10.sp, color = Color.Gray)
                    Text(KameloViewModel.formatArs(bench.marketAvgPrice), fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.DarkGray)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Visual Difference Tag & Bar
            val isBelow = bench.diffPercent < 0
            val absDiff = kotlin.math.abs(bench.diffPercent)
            val tagText = if (isBelow) "Kamelo está ${String.format("%.0f%%", absDiff)} por debajo" else "Kamelo está ${String.format("%.0f%%", absDiff)} por encima"
            val tagColor = if (isBelow) KameloStatusGreen else KameloStatusAmber
            val tagBg = if (isBelow) KameloStatusGreenBg else KameloStatusAmberBg

            Surface(shape = RoundedCornerShape(8.dp), color = tagBg) {
                Text(
                    text = tagText,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = tagColor,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }
        }
    }
}

@Composable
private fun FilterGroupLabel(text: String) {
    Text(
        text = text,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        color = Color.Gray,
        modifier = Modifier.padding(top = 8.dp)
    )
}
