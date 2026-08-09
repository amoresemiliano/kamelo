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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.NavigationTab
import com.example.ui.KameloUiState
import com.example.ui.theme.*

@Composable
fun InicioScreen(
    uiState: KameloUiState,
    onNavigateTab: (NavigationTab) -> Unit,
    onQuickNewFormula: () -> Unit,
    onQuickPrepareProduction: () -> Unit,
    onQuickConsultMarket: () -> Unit,
    onQuickNewProduct: () -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        // Welcome Header Banner
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
                            text = "Hola, bienvenida a Kamelo",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloEspresso,
                            fontFamily = FontFamily.Serif
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Todo lo necesario para gestionar productos, producción, compras y mercado.",
                            fontSize = 14.sp,
                            color = KameloDarkCharcoal.copy(alpha = 0.8f)
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(KameloEspresso),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.LocalFlorist,
                            contentDescription = null,
                            tint = KameloAccentGold,
                            modifier = Modifier.size(30.dp)
                        )
                    }
                }
            }
        }

        // 4 Primary Dashboard Cards
        item {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Text(
                    text = "RESUMEN DE MÓDULOS",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp,
                    color = KameloAmber
                )

                // Grid layout responsive for cards
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    DashboardModuleCard(
                        title = "LABORATORIO",
                        statPrimary = "12 fórmulas activas",
                        statSecondary = "3 actualizadas recientemente",
                        icon = Icons.Outlined.Science,
                        accentColor = KameloAmber,
                        onClick = { onNavigateTab(NavigationTab.LABORATORIO) },
                        modifier = Modifier.weight(1f)
                    )

                    DashboardModuleCard(
                        title = "COMPRAS",
                        statPrimary = "4 órdenes pendientes",
                        statSecondary = "2 proveedores por confirmar",
                        icon = Icons.Outlined.ShoppingCart,
                        accentColor = KameloStatusAmber,
                        onClick = { onNavigateTab(NavigationTab.COMPRAS) },
                        modifier = Modifier.weight(1f)
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    DashboardModuleCard(
                        title = "MERCADO",
                        statPrimary = "146 productos relevados",
                        statSecondary = "Última consulta: ${uiState.lastMarketUpdate}",
                        icon = Icons.Outlined.Analytics,
                        accentColor = KameloSage,
                        onClick = { onNavigateTab(NavigationTab.MERCADO) },
                        modifier = Modifier.weight(1f)
                    )

                    DashboardModuleCard(
                        title = "CATÁLOGO",
                        statPrimary = "28 productos",
                        statSecondary = "22 activos",
                        icon = Icons.Outlined.GridView,
                        accentColor = KameloEspresso,
                        onClick = { onNavigateTab(NavigationTab.CATALOGO) },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Quick Actions Zone
        item {
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = Color.White,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "ACCIONES RÁPIDAS",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.2.sp,
                        color = KameloEspresso
                    )
                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        QuickActionButton(
                            label = "Nueva fórmula",
                            icon = Icons.Default.Add,
                            onClick = onQuickNewFormula,
                            modifier = Modifier.weight(1f)
                        )
                        QuickActionButton(
                            label = "Preparar producción",
                            icon = Icons.Default.PrecisionManufacturing,
                            onClick = onQuickPrepareProduction,
                            modifier = Modifier.weight(1f)
                        )
                        QuickActionButton(
                            label = "Consultar mercado",
                            icon = Icons.Default.Search,
                            onClick = onQuickConsultMarket,
                            modifier = Modifier.weight(1f)
                        )
                        QuickActionButton(
                            label = "Nuevo producto",
                            icon = Icons.Default.LibraryAdd,
                            onClick = onQuickNewProduct,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // Recent Activity Feed
        item {
            Surface(
                shape = RoundedCornerShape(18.dp),
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
                        Text(
                            text = "ACTIVIDAD RECIENTE",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.2.sp,
                            color = KameloEspresso
                        )
                        Text(
                            text = "Ver todo",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = KameloAmber
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    com.example.data.MockData.recentActivities.forEach { activity ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(38.dp)
                                    .clip(CircleShape)
                                    .background(KameloCream),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = when (activity.category) {
                                        "Laboratorio" -> Icons.Default.Science
                                        "Compras" -> Icons.Default.ShoppingCart
                                        "Mercado" -> Icons.Default.Analytics
                                        else -> Icons.Default.GridView
                                    },
                                    contentDescription = null,
                                    tint = KameloEspresso,
                                    modifier = Modifier.size(18.dp)
                                )
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = activity.title,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = KameloDarkCharcoal
                                )
                                Text(
                                    text = "${activity.category} • ${activity.timestamp}",
                                    fontSize = 11.sp,
                                    color = Color.Gray
                                )
                            }

                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = null,
                                tint = Color.LightGray,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        HorizontalDivider(color = KameloMutedBorder.copy(alpha = 0.5f))
                    }
                }
            }
        }
    }
}

@Composable
private fun DashboardModuleCard(
    title: String,
    statPrimary: String,
    statSecondary: String,
    icon: ImageVector,
    accentColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(18.dp),
        color = Color.White,
        border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = accentColor
                )
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(accentColor.copy(alpha = 0.12f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = title,
                        tint = accentColor,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Text(
                text = statPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = KameloEspresso
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = statSecondary,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun QuickActionButton(
    label: String,
    icon: ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(12.dp),
        color = KameloLinen,
        border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(vertical = 12.dp, horizontal = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = KameloEspresso,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = label,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = KameloEspresso,
                maxLines = 1
            )
        }
    }
}
