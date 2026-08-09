package com.example.ui.screens

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
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.OrderStatus
import com.example.model.PurchaseOrder
import com.example.model.PurchaseRequirementGroup
import com.example.ui.KameloUiState
import com.example.ui.KameloViewModel
import com.example.ui.theme.*

@Composable
fun ComprasScreen(
    uiState: KameloUiState,
    onSelectComprasTab: (Int) -> Unit,
    onCreateOrderForSupplier: (PurchaseRequirementGroup) -> Unit,
    modifier: Modifier = Modifier
) {
    val tabs = listOf("Necesidades de compra", "Órdenes de compra", "Proveedores")

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(20.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Gestión de Compras",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = KameloEspresso
                )
                Text(
                    text = "Agrupación automática de insumos por proveedor",
                    fontSize = 13.sp,
                    color = Color.Gray
                )
            }

            Button(
                onClick = { /* Planificación manual action */ },
                colors = ButtonDefaults.buttonColors(
                    containerColor = KameloEspresso,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("+ Nueva planificación", fontWeight = FontWeight.Bold)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Navigation Tabs
        TabRow(
            selectedTabIndex = uiState.selectedComprasTab,
            containerColor = Color.Transparent,
            contentColor = KameloEspresso,
            indicator = { tabPositions ->
                SecondaryTabRowDefaults.SecondaryIndicator(
                    modifier = Modifier.tabIndicatorOffset(tabPositions[uiState.selectedComprasTab]),
                    color = KameloAmber,
                    height = 3.dp
                )
            }
        ) {
            tabs.forEachIndexed { index, title ->
                Tab(
                    selected = uiState.selectedComprasTab == index,
                    onClick = { onSelectComprasTab(index) },
                    text = {
                        Text(
                            text = title,
                            fontWeight = if (uiState.selectedComprasTab == index) FontWeight.Bold else FontWeight.Medium,
                            fontSize = 14.sp
                        )
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Tab Contents
        when (uiState.selectedComprasTab) {
            0 -> NecesidadesTabContent(uiState, onCreateOrderForSupplier)
            1 -> OrdenesTabContent(uiState.purchaseOrders)
            2 -> ProveedoresTabContent(uiState)
        }
    }
}

@Composable
private fun NecesidadesTabContent(
    uiState: KameloUiState,
    onCreateOrderForSupplier: (PurchaseRequirementGroup) -> Unit
) {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(20.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        // Block 1: PRODUCCIÓN PLANIFICADA
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = KameloCream,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "PRODUCCIÓN PLANIFICADA",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = KameloEspresso
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        uiState.plannedProduction.forEach { plan ->
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = Color.White,
                                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                                modifier = Modifier.weight(1f)
                            ) {
                                Row(
                                    modifier = Modifier.padding(14.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(36.dp)
                                            .clip(CircleShape)
                                            .background(KameloLinen),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = "${plan.quantity}",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = KameloAmber
                                        )
                                    }
                                    Column {
                                        Text(plan.productName, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = KameloEspresso)
                                        Text("${plan.variant} • ${plan.quantity} u.", fontSize = 11.sp, color = Color.Gray)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Block 2: REQUERIMIENTOS DE COMPRA (Grouped by Supplier)
        item {
            Text(
                text = "REQUERIMIENTOS DE COMPRA (AGRUPADOS POR PROVEEDOR)",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = KameloAmber
            )
        }

        if (uiState.groupedRequirements.isEmpty()) {
            item {
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = Color.White,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 30.dp)
                ) {
                    Box(modifier = Modifier.padding(30.dp), contentAlignment = Alignment.Center) {
                        Text("No hay requerimientos pendientes de compra.", color = Color.Gray)
                    }
                }
            }
        } else {
            items(uiState.groupedRequirements, key = { it.supplierName }) { group ->
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
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Storefront,
                                    contentDescription = null,
                                    tint = KameloEspresso,
                                    modifier = Modifier.size(22.dp)
                                )
                                Text(
                                    text = group.supplierName,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KameloEspresso
                                )
                            }

                            Button(
                                onClick = { onCreateOrderForSupplier(group) },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = KameloAmber,
                                    contentColor = Color.White
                                ),
                                shape = RoundedCornerShape(10.dp),
                                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                            ) {
                                Text("Crear orden", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        HorizontalDivider(color = KameloMutedBorder.copy(alpha = 0.5f))
                        Spacer(modifier = Modifier.height(12.dp))

                        group.requirements.forEach { req ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 6.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Box(
                                        modifier = Modifier
                                            .size(6.dp)
                                            .clip(CircleShape)
                                            .background(KameloAmber)
                                    )
                                    Text(text = req.materialName, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                                }

                                val displayQty = if (req.unit == "g" && req.totalQuantity >= 1000) {
                                    String.format("%.1f kg", req.totalQuantity / 1000.0)
                                } else if (req.unit == "ml" && req.totalQuantity >= 1000) {
                                    String.format("%.1f L", req.totalQuantity / 1000.0)
                                } else {
                                    "${req.totalQuantity.toInt()} ${req.unit}"
                                }

                                Text(
                                    text = displayQty,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = KameloEspresso
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun OrdenesTabContent(orders: List<PurchaseOrder>) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
        modifier = Modifier.fillMaxSize()
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                text = "ÓRDENES DE COMPRA REGISTRADAS (${orders.size})",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = KameloEspresso
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Table Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(KameloLinen, shape = RoundedCornerShape(8.dp))
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Orden", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.weight(1f))
                Text("Proveedor", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.weight(1.8f))
                Text("Fecha", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.weight(1f))
                Text("Total estimado", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.weight(1.3f))
                Text("Estado", fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.weight(1.2f))
            }

            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(orders, key = { it.id }) { order ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(order.id, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = KameloEspresso, modifier = Modifier.weight(1f))
                        Column(modifier = Modifier.weight(1.8f)) {
                            Text(order.supplierName, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                            Text(order.summary, fontSize = 10.sp, color = Color.Gray, maxLines = 1)
                        }
                        Text(order.date, fontSize = 12.sp, modifier = Modifier.weight(1f))
                        Text(KameloViewModel.formatArs(order.estimatedTotal), fontWeight = FontWeight.Bold, fontSize = 13.sp, color = KameloAmber, modifier = Modifier.weight(1.3f))

                        val (bgColor, textColor) = when (order.status) {
                            OrderStatus.BORRADOR -> Pair(Color(0xFFEEEEEE), Color(0xFF616161))
                            OrderStatus.PENDIENTE -> Pair(KameloStatusAmberBg, KameloStatusAmber)
                            OrderStatus.SOLICITADA -> Pair(KameloStatusBlueBg, KameloStatusBlue)
                            OrderStatus.CONFIRMADA -> Pair(KameloStatusGreenBg, KameloStatusGreen)
                            OrderStatus.RECIBIDA -> Pair(KameloCream, KameloEspresso)
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = bgColor,
                            modifier = Modifier.weight(1.2f)
                        ) {
                            Text(
                                text = order.status.label,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = textColor,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                    HorizontalDivider(color = KameloMutedBorder.copy(alpha = 0.4f))
                }
            }
        }
    }
}

@Composable
private fun ProveedoresTabContent(uiState: KameloUiState) {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        items(uiState.suppliers, key = { it.name }) { supplier ->
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(20.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = supplier.name,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloEspresso
                        )
                        Text(
                            text = supplier.category,
                            fontSize = 12.sp,
                            color = KameloAmber,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Contacto: ${supplier.contactName} • ${supplier.contactDetails}",
                            fontSize = 12.sp,
                            color = Color.Gray
                        )
                    }

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = KameloLinen,
                        border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder)
                    ) {
                        Column(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "${supplier.activeOrdersCount}",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = KameloEspresso
                            )
                            Text(
                                text = "Órdenes activas",
                                fontSize = 10.sp,
                                color = Color.Gray
                            )
                        }
                    }
                }
            }
        }
    }
}
