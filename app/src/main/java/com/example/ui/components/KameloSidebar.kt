package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.NavigationTab
import com.example.ui.theme.*

@Composable
fun KameloSidebar(
    currentTab: NavigationTab,
    onTabSelected: (NavigationTab) -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxHeight()
            .width(260.dp),
        color = KameloLinen,
        tonalElevation = 2.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(vertical = 24.dp, horizontal = 16.dp)
        ) {
            // Brand Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(KameloEspresso),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Filled.LocalFlorist,
                        contentDescription = "Kamelo Icon",
                        tint = KameloAccentGold,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Column {
                    Text(
                        text = "KAMELO",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 3.sp,
                        color = KameloEspresso,
                        fontFamily = FontFamily.Serif
                    )
                    Text(
                        text = "Aromáticos • AR",
                        fontSize = 11.sp,
                        color = KameloAmber,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Section Label
            Text(
                text = "GESTIÓN INTERNA",
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.5.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Navigation Items
            NavigationTab.entries.forEach { tab ->
                val isSelected = currentTab == tab
                val icon = when (tab) {
                    NavigationTab.INICIO -> if (isSelected) Icons.Filled.Home else Icons.Outlined.Home
                    NavigationTab.LABORATORIO -> if (isSelected) Icons.Filled.Science else Icons.Outlined.Science
                    NavigationTab.COMPRAS -> if (isSelected) Icons.Filled.ShoppingCart else Icons.Outlined.ShoppingCart
                    NavigationTab.MERCADO -> if (isSelected) Icons.Filled.Analytics else Icons.Outlined.Analytics
                    NavigationTab.CATALOGO -> if (isSelected) Icons.Filled.GridView else Icons.Outlined.GridView
                }

                Surface(
                    onClick = { onTabSelected(tab) },
                    shape = RoundedCornerShape(12.dp),
                    color = if (isSelected) KameloEspresso else Color.Transparent,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 3.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                        modifier = Modifier
                            .padding(horizontal = 14.dp, vertical = 12.dp)
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = tab.title,
                            tint = if (isSelected) KameloAccentGold else KameloDarkCharcoal.copy(alpha = 0.75f),
                            modifier = Modifier.size(22.dp)
                        )
                        Text(
                            text = tab.title,
                            fontSize = 14.sp,
                            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Medium,
                            color = if (isSelected) Color.White else KameloDarkCharcoal
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Bottom SME Info Box
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = KameloCream,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(KameloAmber),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "K",
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            fontSize = 16.sp
                        )
                    }
                    Column {
                        Text(
                            text = "Kamelo Taller",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloEspresso
                        )
                        Text(
                            text = "v1.0 MVP • Argentina",
                            fontSize = 10.sp,
                            color = KameloDarkCharcoal.copy(alpha = 0.6f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun KameloHeader(
    currentTab: NavigationTab,
    onOpenSidebarDrawer: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        color = Color.White,
        tonalElevation = 1.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                if (onOpenSidebarDrawer != null) {
                    IconButton(onClick = onOpenSidebarDrawer) {
                        Icon(
                            imageVector = Icons.Default.Menu,
                            contentDescription = "Abrir menú",
                            tint = KameloEspresso
                        )
                    }
                }
                Column {
                    Text(
                        text = currentTab.title,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = KameloEspresso
                    )
                    Text(
                        text = "Plataforma interna • Moneda ARS ($)",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Right Status pill
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = KameloCream,
                border = androidx.compose.foundation.BorderStroke(1.dp, KameloMutedBorder)
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(KameloStatusGreen)
                    )
                    Text(
                        text = "Modo Local Mock",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = KameloEspresso
                    )
                }
            }
        }
    }
}
