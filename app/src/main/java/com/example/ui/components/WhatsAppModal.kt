package com.example.ui.components

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.MockData
import com.example.model.CatalogProduct
import com.example.model.ClientMock
import com.example.ui.KameloViewModel
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WhatsAppModal(
    product: CatalogProduct,
    selectedSize: String,
    selectedAroma: String,
    selectedClient: ClientMock,
    onUpdateSize: (String) -> Unit,
    onUpdateAroma: (String) -> Unit,
    onUpdateClient: (ClientMock) -> Unit,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    var clientDropdownExpanded by remember { mutableStateOf(false) }

    val currentPrice = product.sizePrices[selectedSize] ?: product.startingPrice
    val formattedPrice = KameloViewModel.formatArs(currentPrice)
    val clientFirstName = selectedClient.name.split(" ").firstOrNull() ?: selectedClient.name

    val messageText = """
Hola $clientFirstName 👋

Te comparto nuestra ${product.name} de $selectedSize en aroma $selectedAroma.

Precio: $formattedPrice.

Si querés, te cuento las opciones disponibles.
    """.trimIndent()

    AlertDialog(
        onDismissRequest = onDismiss,
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = Color.White,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(KameloStatusGreenBg),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Share,
                                contentDescription = null,
                                tint = KameloStatusGreen,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Text(
                            text = "COMPARTIR PRODUCTO",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = KameloEspresso,
                            letterSpacing = 0.5.sp
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Cerrar")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Client Selector Dropdown
                Text(
                    text = "Cliente:",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = KameloDarkCharcoal
                )
                Spacer(modifier = Modifier.height(4.dp))
                ExposedDropdownMenuBox(
                    expanded = clientDropdownExpanded,
                    onExpandedChange = { clientDropdownExpanded = !clientDropdownExpanded },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    OutlinedTextField(
                        value = "${selectedClient.name} (${selectedClient.type})",
                        onValueChange = {},
                        readOnly = true,
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = clientDropdownExpanded) },
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            unfocusedBorderColor = KameloMutedBorder,
                            focusedBorderColor = KameloAmber
                        ),
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth()
                    )
                    ExposedDropdownMenu(
                        expanded = clientDropdownExpanded,
                        onDismissRequest = { clientDropdownExpanded = false }
                    ) {
                        MockData.sampleClients.forEach { client ->
                            DropdownMenuItem(
                                text = {
                                    Column {
                                        Text(text = client.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        Text(text = "${client.type} • ${client.phone}", fontSize = 11.sp, color = Color.Gray)
                                    }
                                },
                                onClick = {
                                    onUpdateClient(client)
                                    clientDropdownExpanded = false
                                }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Product summary line
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(KameloLinen)
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = product.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = KameloEspresso)
                        Text(text = "Categoría: ${product.category}", fontSize = 11.sp, color = Color.Gray)
                    }
                    Text(
                        text = formattedPrice,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = KameloAmber
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Variant selectors (Tamaño & Aroma)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = "Tamaño:", fontSize = 12.sp, fontWeight = FontWeight.Medium)
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            product.sizes.forEach { size ->
                                FilterChip(
                                    selected = size == selectedSize,
                                    onClick = { onUpdateSize(size) },
                                    label = { Text(text = size, fontSize = 11.sp) }
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(text = "Aroma:", fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        product.aromas.take(4).forEach { aroma ->
                            FilterChip(
                                selected = aroma == selectedAroma,
                                onClick = { onUpdateAroma(aroma) },
                                label = { Text(text = aroma, fontSize = 11.sp) }
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Message Preview Card
                Text(
                    text = "VISTA PREVIA DEL MENSAJE",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = KameloAmber,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFE7F8EC), // Soft WhatsApp green tint
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF25D366).copy(alpha = 0.4f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = messageText,
                        fontSize = 13.sp,
                        color = Color(0xFF111111),
                        fontFamily = FontFamily.SansSerif,
                        lineHeight = 18.sp,
                        modifier = Modifier.padding(14.dp)
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Action Buttons
                Button(
                    onClick = {
                        val intent = Intent(Intent.ACTION_VIEW).apply {
                            val encodedMsg = Uri.encode(messageText)
                            val cleanPhone = selectedClient.phone.replace("[^0-9]".toRegex(), "")
                            data = Uri.parse("https://api.whatsapp.com/send?phone=$cleanPhone&text=$encodedMsg")
                        }
                        try {
                            context.startActivity(intent)
                        } catch (e: Exception) {
                            Toast.makeText(context, "Iniciando simulador de WhatsApp...", Toast.LENGTH_SHORT).show()
                        }
                        onDismiss()
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF25D366),
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                ) {
                    Icon(imageVector = Icons.Default.Send, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "Abrir WhatsApp", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                }
            }
        }
    }
}
