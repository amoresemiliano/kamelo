package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Formula
import com.example.ui.KameloUiState
import com.example.ui.KameloViewModel
import com.example.ui.theme.*

@Composable
fun LaboratorioScreen(
    uiState: KameloUiState,
    onSelectFormula: (Formula) -> Unit,
    onOpenNewFormulaDialog: () -> Unit,
    onSetQuantity: (Int) -> Unit,
    onSubmitProductionPlan: (Formula, Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    val filteredFormulas = uiState.formulas.filter {
        it.productName.contains(searchQuery, ignoreCase = true) ||
                it.category.contains(searchQuery, ignoreCase = true)
    }

    val selected = uiState.selectedFormula ?: uiState.formulas.firstOrNull()

    Row(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Left Column: List of Formulas
        Column(
            modifier = Modifier
                .weight(0.45f)
                .fillMaxHeight()
        ) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxSize()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "FÓRMULAS (${filteredFormulas.size})",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloEspresso
                        )
                        Button(
                            onClick = onOpenNewFormulaDialog,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = KameloEspresso,
                                contentColor = Color.White
                            ),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("+ Nueva fórmula", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("Buscar fórmula...", fontSize = 13.sp) },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(18.dp)) },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        items(filteredFormulas, key = { it.id }) { formula ->
                            val isSelected = selected?.id == formula.id
                            Surface(
                                onClick = { onSelectFormula(formula) },
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSelected) KameloCream else KameloLinen,
                                border = androidx.compose.foundation.BorderStroke(
                                    1.dp,
                                    if (isSelected) KameloAmber else KameloMutedBorder
                                ),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.padding(14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = formula.productName,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = KameloEspresso
                                        )
                                        Spacer(modifier = Modifier.height(2.dp))
                                        Text(
                                            text = "${formula.variant} • ${formula.category}",
                                            fontSize = 12.sp,
                                            color = Color.Gray
                                        )
                                    }

                                    Column(horizontalAlignment = Alignment.End) {
                                        Text(
                                            text = KameloViewModel.formatArs(formula.estimatedCost),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = KameloAmber
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Surface(
                                            shape = RoundedCornerShape(8.dp),
                                            color = if (formula.status == "Activa") KameloStatusGreenBg else KameloStatusAmberBg
                                        ) {
                                            Text(
                                                text = formula.status,
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = if (formula.status == "Activa") KameloStatusGreen else KameloStatusAmber,
                                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Right Column: Formula Detail Sheet & Production Calculator
        Column(
            modifier = Modifier
                .weight(0.55f)
                .fillMaxHeight()
        ) {
            if (selected != null) {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    // Formula Header Info Card
                    item {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = Color.White,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.Top
                                ) {
                                    Column {
                                        Text(
                                            text = selected.productName,
                                            fontSize = 20.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = KameloEspresso
                                        )
                                        Text(
                                            text = "Variante: ${selected.variant} | Categoría: ${selected.category}",
                                            fontSize = 13.sp,
                                            color = Color.Gray
                                        )
                                    }

                                    Surface(
                                        shape = RoundedCornerShape(10.dp),
                                        color = KameloStatusGreenBg
                                    ) {
                                        Text(
                                            text = selected.status,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = KameloStatusGreen,
                                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                // Metrics Grid
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    MetricBox(
                                        label = "Coste estimado/u",
                                        value = KameloViewModel.formatArs(selected.estimatedCost),
                                        highlight = true,
                                        modifier = Modifier.weight(1f)
                                    )
                                    val salePrice = selected.defaultSalePrice ?: 18500.0
                                    val marginPercent = ((salePrice - selected.estimatedCost) / salePrice) * 100
                                    MetricBox(
                                        label = "Margen estimado",
                                        value = String.format("%.1f%%", marginPercent),
                                        highlight = false,
                                        modifier = Modifier.weight(1f)
                                    )
                                    MetricBox(
                                        label = "Rendimiento",
                                        value = "${selected.yieldUnits} unidad",
                                        highlight = false,
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }
                    }

                    // Ingredients Table
                    item {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = Color.White,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text(
                                    text = "TABLA DE INGREDIENTES",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp,
                                    color = KameloEspresso
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Table Header
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(KameloLinen, shape = RoundedCornerShape(8.dp))
                                        .padding(horizontal = 10.dp, vertical = 8.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Ingrediente", fontWeight = FontWeight.Bold, fontSize = 11.sp, modifier = Modifier.weight(1.8f))
                                    Text("Cant.", fontWeight = FontWeight.Bold, fontSize = 11.sp, modifier = Modifier.weight(1f))
                                    Text("C. Unit", fontWeight = FontWeight.Bold, fontSize = 11.sp, modifier = Modifier.weight(1f))
                                    Text("Total", fontWeight = FontWeight.Bold, fontSize = 11.sp, modifier = Modifier.weight(1f))
                                    Text("Proveedor", fontWeight = FontWeight.Bold, fontSize = 11.sp, modifier = Modifier.weight(1.5f))
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                selected.ingredients.forEach { ing ->
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(horizontal = 10.dp, vertical = 8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(ing.name, fontSize = 12.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1.8f))
                                        Text("${ing.quantityPerUnit} ${ing.unit}", fontSize = 12.sp, modifier = Modifier.weight(1f))
                                        Text(KameloViewModel.formatArs(ing.unitCost), fontSize = 11.sp, color = Color.Gray, modifier = Modifier.weight(1f))
                                        Text(KameloViewModel.formatArs(ing.totalCost), fontSize = 12.sp, fontWeight = FontWeight.Bold, color = KameloEspresso, modifier = Modifier.weight(1f))
                                        Text(ing.supplier, fontSize = 11.sp, color = KameloAmber, modifier = Modifier.weight(1.5f))
                                    }
                                    HorizontalDivider(color = KameloMutedBorder.copy(alpha = 0.4f))
                                }

                                Spacer(modifier = Modifier.height(12.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.End,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("Coste total estimado por unidad: ", fontSize = 12.sp, fontWeight = FontWeight.Medium)
                                    Text(
                                        text = KameloViewModel.formatArs(selected.estimatedCost),
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = KameloAmber
                                    )
                                }
                            }
                        }
                    }

                    // Production Calculator Section
                    item {
                        Surface(
                            shape = RoundedCornerShape(16.dp),
                            color = KameloCream,
                            border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text(
                                    text = "CALCULADOR DE PRODUCCIÓN",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp,
                                    color = KameloEspresso
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = "¿Cuántas unidades querés producir?",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = KameloDarkCharcoal
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    listOf(10, 25, 50, 100).forEach { qty ->
                                        FilterChip(
                                            selected = uiState.productionQuantity == qty,
                                            onClick = { onSetQuantity(qty) },
                                            label = { Text("$qty u.", fontWeight = FontWeight.Bold) },
                                            colors = FilterChipDefaults.filterChipColors(
                                                selectedContainerColor = KameloEspresso,
                                                selectedLabelColor = Color.White
                                            )
                                        )
                                    }

                                    OutlinedTextField(
                                        value = uiState.productionQuantity.toString(),
                                        onValueChange = { input ->
                                            input.toIntOrNull()?.let { onSetQuantity(it) }
                                        },
                                        label = { Text("Personalizado") },
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                        modifier = Modifier.weight(1f),
                                        shape = RoundedCornerShape(10.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Text(
                                    text = "Materiales requeridos para ${uiState.productionQuantity} unidades:",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KameloEspresso
                                )

                                Spacer(modifier = Modifier.height(8.dp))

                                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                    selected.ingredients.forEach { ing ->
                                        val totalQtyNeeded = ing.quantityPerUnit * uiState.productionQuantity
                                        val displayQty = if (ing.unit == "g" && totalQtyNeeded >= 1000) {
                                            String.format("%.1f kg", totalQtyNeeded / 1000.0)
                                        } else if (ing.unit == "ml" && totalQtyNeeded >= 1000) {
                                            String.format("%.1f L", totalQtyNeeded / 1000.0)
                                        } else {
                                            "${totalQtyNeeded.toInt()} ${ing.unit}"
                                        }

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text("• ${ing.name}", fontSize = 12.sp, color = KameloDarkCharcoal)
                                            Text(displayQty, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = KameloEspresso)
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(20.dp))

                                Button(
                                    onClick = { onSubmitProductionPlan(selected, uiState.productionQuantity) },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = KameloEspresso,
                                        contentColor = Color.White
                                    ),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(48.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.PrecisionManufacturing, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Preparar producción", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                }
                            }
                        }
                    }
                }
            } else {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Seleccioná una fórmula para ver el detalle", color = Color.Gray)
                }
            }
        }
    }
}

@Composable
private fun MetricBox(
    label: String,
    value: String,
    highlight: Boolean,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(12.dp),
        color = if (highlight) KameloCream else KameloLinen,
        border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(text = label, fontSize = 10.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = if (highlight) KameloAmber else KameloEspresso
            )
        }
    }
}
