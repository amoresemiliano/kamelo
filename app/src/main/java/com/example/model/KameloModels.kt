package com.example.model

enum class NavigationTab(val title: String, val iconName: String) {
    INICIO("Inicio", "home"),
    LABORATORIO("Laboratorio", "science"),
    COMPRAS("Compras", "shopping_cart"),
    MERCADO("Inteligencia de mercado", "analytics"),
    CATALOGO("Catálogo", "grid_view")
}

data class Formula(
    val id: String,
    val productName: String,
    val variant: String,
    val category: String,
    val estimatedCost: Double,
    val lastUpdated: String,
    val status: String, // "Activa", "Borrador"
    val yieldUnits: Int = 1,
    val defaultSalePrice: Double? = null,
    val ingredients: List<FormulaIngredient>
)

data class FormulaIngredient(
    val id: String,
    val name: String,
    val quantityPerUnit: Double,
    val unit: String,
    val unitCost: Double,
    val supplier: String
) {
    val totalCost: Double
        get() = quantityPerUnit * unitCost
}

data class ProductionPlanItem(
    val formulaId: String,
    val productName: String,
    val variant: String,
    val quantity: Int
)

data class PurchaseRequirementGroup(
    val supplierName: String,
    val requirements: List<PurchaseRequirementItem>
)

data class PurchaseRequirementItem(
    val materialName: String,
    val totalQuantity: Double,
    val unit: String
)

enum class OrderStatus(val label: String) {
    BORRADOR("Borrador"),
    PENDIENTE("Pendiente"),
    SOLICITADA("Solicitada"),
    CONFIRMADA("Confirmada"),
    RECIBIDA("Recibida")
}

data class PurchaseOrder(
    val id: String,
    val supplierName: String,
    val date: String,
    val estimatedTotal: Double,
    val status: OrderStatus,
    val summary: String
)

data class SupplierInfo(
    val name: String,
    val category: String,
    val contactName: String,
    val contactDetails: String,
    val activeOrdersCount: Int
)

data class MarketProduct(
    val id: String,
    val imageUrl: String,
    val brand: String,
    val productName: String,
    val category: String,
    val size: String,
    val aroma: String,
    val price: Double,
    val promoPrice: Double? = null,
    val location: String,
    val source: String,
    val date: String
)

data class MarketBenchmark(
    val title: String,
    val sizeLabel: String,
    val kameloPrice: Double,
    val marketAvgPrice: Double,
    val diffPercent: Double
)

data class CatalogProduct(
    val id: String,
    val imageUrl: String,
    val gallery: List<String>,
    val name: String,
    val shortDescription: String,
    val fullDescription: String,
    val category: String,
    val collection: String,
    val startingPrice: Double,
    val status: String, // "Activo", "Borrador"
    val sizes: List<String>,
    val aromas: List<String>,
    val sizePrices: Map<String, Double>
)

data class ClientMock(
    val id: String,
    val name: String,
    val type: String, // "Minorista", "Mayorista / Estudio"
    val phone: String
)

data class RecentActivity(
    val id: String,
    val title: String,
    val timestamp: String,
    val category: String
)
