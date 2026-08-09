package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val KameloLightColorScheme = lightColorScheme(
    primary = KameloEspresso,
    onPrimary = Color.White,
    primaryContainer = KameloCream,
    onPrimaryContainer = KameloDarkCharcoal,
    secondary = KameloAmber,
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFFDF4EC),
    onSecondaryContainer = Color(0xFF422610),
    tertiary = KameloSage,
    onTertiary = Color.White,
    tertiaryContainer = Color(0xFFEFF3EC),
    onTertiaryContainer = Color(0xFF24331C),
    background = KameloLinen,
    onBackground = KameloDarkCharcoal,
    surface = KameloWarmWhite,
    onSurface = KameloDarkCharcoal,
    surfaceVariant = Color(0xFFF2EAE1),
    onSurfaceVariant = Color(0xFF52453E),
    outline = KameloMutedBorder,
    outlineVariant = Color(0xFFEAE0D5)
)

private val KameloDarkColorScheme = darkColorScheme(
    primary = KameloAccentGold,
    onPrimary = KameloDarkCharcoal,
    primaryContainer = Color(0xFF38251B),
    onPrimaryContainer = KameloCream,
    secondary = KameloAmber,
    onSecondary = KameloDarkCharcoal,
    tertiary = KameloSage,
    background = Color(0xFF1E1917),
    onBackground = Color(0xFFEBE3DD),
    surface = Color(0xFF26201D),
    onSurface = Color(0xFFEBE3DD),
    surfaceVariant = Color(0xFF3B322D),
    onSurfaceVariant = Color(0xFFD4C7BF)
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Use Kamelo boutique theme by default
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) KameloDarkColorScheme else KameloLightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
