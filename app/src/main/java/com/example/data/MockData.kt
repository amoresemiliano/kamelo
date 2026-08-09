package com.example.data

import com.example.model.*

object MockData {

    val recentActivities = listOf(
        RecentActivity("1", "Fórmula \"Vela Ámbar 200 g\" actualizada", "Hace 15 min", "Laboratorio"),
        RecentActivity("2", "Nueva orden solicitada para Packaging Norte", "Hace 2 horas", "Compras"),
        RecentActivity("3", "Benchmark de mercado actualizado (146 productos)", "Hace 1 día", "Mercado"),
        RecentActivity("4", "Producto \"Vela Botánica\" editado en Catálogo", "Hace 2 días", "Catálogo"),
        RecentActivity("5", "Lote de producción #42 de Vela Lavanda finalizado", "Hace 3 días", "Laboratorio")
    )

    val sampleIngredientsVelaAmbar200g = listOf(
        FormulaIngredient("i1", "Cera de soja", 170.0, "g", 25.0, "CERAS DEL SUR"),
        FormulaIngredient("i2", "Fragancia Vainilla", 12.0, "g", 150.0, "ESENCIAS XYZ"),
        FormulaIngredient("i3", "Fragancia Ámbar", 8.0, "g", 150.0, "ESENCIAS XYZ"),
        FormulaIngredient("i4", "Aditivo", 2.0, "g", 50.0, "CERAS DEL SUR"),
        FormulaIngredient("i5", "Mecha", 1.0, "unidad", 100.0, "CERAS DEL SUR"),
        FormulaIngredient("i6", "Envase vidrio 200g", 1.0, "unidad", 300.0, "PACKAGING NORTE"),
        FormulaIngredient("i7", "Tapa de madera", 1.0, "unidad", 80.0, "PACKAGING NORTE"),
        FormulaIngredient("i8", "Etiqueta Kamelo", 1.0, "unidad", 20.0, "IMPRENTA AR")
    )

    val sampleIngredientsVelaLavanda350g = listOf(
        FormulaIngredient("i21", "Cera de soja", 310.0, "g", 25.0, "CERAS DEL SUR"),
        FormulaIngredient("i22", "Fragancia Lavanda", 28.0, "g", 110.0, "ESENCIAS XYZ"),
        FormulaIngredient("i23", "Aditivo vegetal", 4.0, "g", 50.0, "CERAS DEL SUR"),
        FormulaIngredient("i24", "Mecha doble de algodón", 1.0, "unidad", 130.0, "CERAS DEL SUR"),
        FormulaIngredient("i25", "Envase ambar 350g", 1.0, "unidad", 450.0, "PACKAGING NORTE"),
        FormulaIngredient("i26", "Tapa metalizada", 1.0, "unidad", 90.0, "PACKAGING NORTE"),
        FormulaIngredient("i27", "Etiqueta vinílica", 1.0, "unidad", 25.0, "IMPRENTA AR")
    )

    val sampleIngredientsDifusorSandalo = listOf(
        FormulaIngredient("i31", "Alcohol de cereales", 180.0, "ml", 15.0, "CERAS DEL SUR"),
        FormulaIngredient("i32", "Esencia pura Sándalo", 45.0, "ml", 100.0, "ESENCIAS XYZ"),
        FormulaIngredient("i33", "Solución fijadora", 25.0, "ml", 20.0, "ESENCIAS XYZ"),
        FormulaIngredient("i34", "Frasco pet difusor 250ml", 1.0, "unidad", 350.0, "PACKAGING NORTE"),
        FormulaIngredient("i35", "Varillas de rattan (x6)", 1.0, "pack", 120.0, "PACKAGING NORTE")
    )

    val initialFormulas = listOf(
        Formula(
            id = "f1",
            productName = "Vela Ámbar & Vainilla",
            variant = "200 g",
            category = "Velas",
            estimatedCost = 7850.0,
            lastUpdated = "Hace 2 días",
            status = "Activa",
            yieldUnits = 1,
            defaultSalePrice = 18500.0,
            ingredients = sampleIngredientsVelaAmbar200g
        ),
        Formula(
            id = "f2",
            productName = "Vela Lavanda",
            variant = "350 g",
            category = "Velas",
            estimatedCost = 11400.0,
            lastUpdated = "Ayer",
            status = "Activa",
            yieldUnits = 1,
            defaultSalePrice = 29900.0,
            ingredients = sampleIngredientsVelaLavanda350g
        ),
        Formula(
            id = "f3",
            productName = "Difusor Sándalo",
            variant = "250 ml",
            category = "Difusores",
            estimatedCost = 8200.0,
            lastUpdated = "Hace 5 días",
            status = "Borrador",
            yieldUnits = 1,
            defaultSalePrice = 19500.0,
            ingredients = sampleIngredientsDifusorSandalo
        ),
        Formula(
            id = "f4",
            productName = "Vela Botánica",
            variant = "350 g",
            category = "Velas",
            estimatedCost = 11800.0,
            lastUpdated = "Hace 1 semana",
            status = "Activa",
            yieldUnits = 1,
            defaultSalePrice = 29900.0,
            ingredients = sampleIngredientsVelaLavanda350g
        ),
        Formula(
            id = "f5",
            productName = "Spray Textil Lavanda",
            variant = "500 ml",
            category = "Textil",
            estimatedCost = 4500.0,
            lastUpdated = "Hace 3 días",
            status = "Activa",
            yieldUnits = 1,
            defaultSalePrice = 12500.0,
            ingredients = sampleIngredientsDifusorSandalo
        ),
        Formula(
            id = "f6",
            productName = "Vela Bosque Citrus",
            variant = "500 g",
            category = "Velas",
            estimatedCost = 15200.0,
            lastUpdated = "Hace 4 días",
            status = "Activa",
            yieldUnits = 1,
            defaultSalePrice = 39000.0,
            ingredients = sampleIngredientsVelaAmbar200g
        )
    )

    val initialPlannedProduction = listOf(
        ProductionPlanItem("f1", "Vela Ámbar & Vainilla", "200 g", 50),
        ProductionPlanItem("f2", "Vela Lavanda", "350 g", 20)
    )

    val initialGroupedRequirements = listOf(
        PurchaseRequirementGroup(
            supplierName = "CERAS DEL SUR",
            requirements = listOf(
                PurchaseRequirementItem("Cera de soja", 14.7, "kg"),
                PurchaseRequirementItem("Aditivo vegetal", 500.0, "g"),
                PurchaseRequirementItem("Mecha de algodón", 70.0, "unidades")
            )
        ),
        PurchaseRequirementGroup(
            supplierName = "ESENCIAS XYZ",
            requirements = listOf(
                PurchaseRequirementItem("Fragancia Vainilla", 600.0, "ml"),
                PurchaseRequirementItem("Fragancia Ámbar", 400.0, "ml"),
                PurchaseRequirementItem("Fragancia Lavanda", 300.0, "ml")
            )
        ),
        PurchaseRequirementGroup(
            supplierName = "PACKAGING NORTE",
            requirements = listOf(
                PurchaseRequirementItem("Envase cristal 200 ml", 50.0, "unidades"),
                PurchaseRequirementItem("Envase ámbar 350 ml", 20.0, "unidades"),
                PurchaseRequirementItem("Tapas artesanales", 70.0, "unidades")
            )
        )
    )

    val initialPurchaseOrders = listOf(
        PurchaseOrder("OC-2026-004", "Packaging Norte", "07/08/2026", 124000.0, OrderStatus.PENDIENTE, "50 frascos 200ml, 20 frascos 350ml, 70 tapas"),
        PurchaseOrder("OC-2026-003", "Esencias XYZ", "05/08/2026", 315000.0, OrderStatus.SOLICITADA, "600ml Vainilla, 400ml Ámbar, 300ml Lavanda"),
        PurchaseOrder("OC-2026-002", "Ceras del Sur", "01/08/2026", 480000.0, OrderStatus.CONFIRMADA, "25kg Cera de Soja premium, 2kg Aditivo"),
        PurchaseOrder("OC-2026-001", "Imprenta AR", "25/07/2026", 68500.0, OrderStatus.RECIBIDA, "500 Etiquetas Kamelo oro mate")
    )

    val suppliers = listOf(
        SupplierInfo("CERAS DEL SUR", "Materia Prima (Ceras y Mechas)", "Carlos Rossi", "carlos@cerasdelsur.com.ar | 11 4455-8899", 1),
        SupplierInfo("ESENCIAS XYZ", "Fragancias y Aceites", "Mariana López", "ventas@esenciasxyz.com.ar | 11 6789-1234", 1),
        SupplierInfo("PACKAGING NORTE", "Envases de Vidrio y Tapas", "Gabriel Fernández", "gaby@packagingnorte.com | 11 3322-1100", 1),
        SupplierInfo("IMPRENTA AR", "Gráfica y Etiquetas", "Lucía Varela", "contacto@imprentaar.com | 11 5544-3322", 0)
    )

    val marketBenchmarks = listOf(
        MarketBenchmark("VELA 200 G", "Velas en frasco 200 g", 18500.0, 21300.0, -13.1),
        MarketBenchmark("VELA 350 G", "Velas en frasco 350 g", 29900.0, 28400.0, 5.3),
        MarketBenchmark("DIFUSOR 250 ML", "Difusores de ambiente 250 ml", 19500.0, 22000.0, -11.4)
    )

    val initialMarketProducts = listOf(
        MarketProduct("m1", "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400", "Kamelo", "Vela Ámbar", "Velas", "200 g", "Ámbar", 18500.0, null, "CABA", "tiendas online", "Hoy"),
        MarketProduct("m2", "https://images.unsplash.com/photo-1596435707659-ae868688f7f9?w=400", "Botanical Home", "Vela Soja Luxury", "Velas", "200 g", "Vainilla", 22500.0, 21000.0, "CABA", "Mercado Libre", "Hoy"),
        MarketProduct("m3", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", "Aroma BAZAR", "Vela Artesanal Ámbar", "Velas", "200 g", "Ámbar", 19900.0, null, "Zona Norte GBA", "tiendas online", "Ayer"),
        MarketProduct("m4", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400", "Velas del Alma", "Vela Vainilla Caramel", "Velas", "200 g", "Vainilla", 24000.0, 22800.0, "Buenos Aires", "marcas independientes", "Ayer"),
        MarketProduct("m5", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400", "Kamelo", "Vela Botánica", "Velas", "350 g", "Lavanda", 29900.0, null, "CABA", "tiendas online", "Hace 2 días"),
        MarketProduct("m6", "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=400", "Boutique Olfativa", "Vela Grande Soja", "Velas", "350 g", "Sándalo", 27500.0, null, "Zona Norte GBA", "ecommerce especializados", "Hace 2 días"),
        MarketProduct("m7", "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=400", "Pampa Aromas", "Vela Naranja & Canela", "Velas", "350 g", "Especiado", 31000.0, 28900.0, "Argentina", "Mercado Libre", "Hace 3 días"),
        MarketProduct("m8", "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400", "Kamelo", "Difusor Sándalo", "Difusores", "250 ml", "Sándalo", 19500.0, null, "CABA", "tiendas online", "Hoy"),
        MarketProduct("m9", "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=400", "Aroma BAZAR", "Difusor de Varillas Premium", "Difusores", "250 ml", "Sándalo", 23500.0, 21900.0, "CABA", "tiendas online", "Ayer"),
        MarketProduct("m10", "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400", "Savia Natural", "Difusor Flores Blancas", "Difusores", "250 ml", "Flores Blancas", 21000.0, null, "Argentina", "marcas independientes", "Ayer"),
        MarketProduct("m11", "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=400", "Kamelo", "Spray Textil Lavanda", "Textil", "500 ml", "Lavanda", 12500.0, null, "CABA", "tiendas online", "Ayer"),
        MarketProduct("m12", "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400", "Home Scent Co.", "Home Spray Aromático", "Textil", "500 ml", "Lavanda", 14900.0, 13500.0, "Zona Norte GBA", "ecommerce especializados", "Hace 3 días"),
        MarketProduct("m13", "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400", "Luz & Sombra", "Vela Vasito Soja", "Velas", "200 g", "Bosque", 17900.0, null, "Buenos Aires", "Mercado Libre", "Hace 3 días"),
        MarketProduct("m14", "https://images.unsplash.com/photo-1596435707659-ae868688f7f9?w=400", "Natura Scent", "Vela Edición Limitada", "Velas", "500 g", "Ámbar", 42000.0, 39500.0, "CABA", "tiendas online", "Hace 4 días"),
        MarketProduct("m15", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400", "Kamelo", "Vela Bosque", "Velas", "500 g", "Bosque", 39000.0, null, "CABA", "tiendas online", "Hace 4 días")
    )

    val catalogProducts = listOf(
        CatalogProduct(
            id = "cp1",
            imageUrl = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600",
            gallery = listOf(
                "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600",
                "https://images.unsplash.com/photo-1596435707659-ae868688f7f9?w=600",
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"
            ),
            name = "Vela Botánica",
            shortDescription = "Vela artesanal elaborada con cera de soja y fragancias seleccionadas para crear una experiencia cálida y envolvente.",
            fullDescription = "Vela artesanal elaborada con 100% cera de soja vegetal de bajo punto de fusión, vertida a mano en pequeños lotes. Fragancias finas libres de ftalatos que infunden calma, calidez e introspección en tus espacios.",
            category = "Velas",
            collection = "Botánica",
            startingPrice = 18500.0,
            status = "Activo",
            sizes = listOf("200 g", "350 g", "500 g"),
            aromas = listOf("Vainilla", "Ámbar", "Lavanda", "Sándalo"),
            sizePrices = mapOf(
                "200 g" to 18500.0,
                "350 g" to 29900.0,
                "500 g" to 39000.0
            )
        ),
        CatalogProduct(
            id = "cp2",
            imageUrl = "https://images.unsplash.com/photo-1596435707659-ae868688f7f9?w=600",
            gallery = listOf(
                "https://images.unsplash.com/photo-1596435707659-ae868688f7f9?w=600",
                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600"
            ),
            name = "Vela Ámbar",
            shortDescription = "Intensas notas resinosas y amaderadas envueltas en la calidez del ámbar dorado.",
            fullDescription = "Una de nuestras creaciones insignias. Combina resinas orientales, toques de bálsamo y notas de fondo aterciopeladas para transformar cualquier ambiente en un refugio de paz.",
            category = "Velas",
            collection = "Esenciales",
            startingPrice = 18500.0,
            status = "Activo",
            sizes = listOf("200 g", "350 g", "500 g"),
            aromas = listOf("Ámbar", "Vainilla"),
            sizePrices = mapOf(
                "200 g" to 18500.0,
                "350 g" to 29900.0,
                "500 g" to 39000.0
            )
        ),
        CatalogProduct(
            id = "cp3",
            imageUrl = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
            gallery = listOf("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600"),
            name = "Vela Lavanda",
            shortDescription = "Aceite esencial de lavanda silvestre con matices florales y herbales relajantes.",
            fullDescription = "Ideal para momentos de lectura, meditación y desaceleración nocturna. Elaborada con aceite esencial puro de lavanda silvestre cultivada en valles patagónicos.",
            category = "Velas",
            collection = "Esenciales",
            startingPrice = 18500.0,
            status = "Activo",
            sizes = listOf("200 g", "350 g"),
            aromas = listOf("Lavanda"),
            sizePrices = mapOf(
                "200 g" to 18500.0,
                "350 g" to 29900.0
            )
        ),
        CatalogProduct(
            id = "cp4",
            imageUrl = "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600",
            gallery = listOf("https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600"),
            name = "Vela Vainilla Bourbon",
            shortDescription = "Dulzura especiada y elegante con acordes de vainilla de Madagascar.",
            fullDescription = "Fragancia cálida y gourmand que invita a compartir hogar. Notas de vainas puras de vainilla con un sutil destello de orquídea silvestre.",
            category = "Velas",
            collection = "Otoño/Invierno",
            startingPrice = 18500.0,
            status = "Activo",
            sizes = listOf("200 g", "350 g"),
            aromas = listOf("Vainilla"),
            sizePrices = mapOf(
                "200 g" to 18500.0,
                "350 g" to 29900.0
            )
        ),
        CatalogProduct(
            id = "cp5",
            imageUrl = "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600",
            gallery = listOf("https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=600"),
            name = "Vela Bosque",
            shortDescription = "Aromas a corteza de cedro, pino verde y musgo tras la lluvia.",
            fullDescription = "Un paseo sensorial por bosques húmedos y frondosos. Sus notas amaderadas estimulan la frescura y la renovación del ambiente.",
            category = "Velas",
            collection = "Botánica",
            startingPrice = 19200.0,
            status = "Activo",
            sizes = listOf("200 g", "500 g"),
            aromas = listOf("Bosque"),
            sizePrices = mapOf(
                "200 g" to 19200.0,
                "500 g" to 39000.0
            )
        ),
        CatalogProduct(
            id = "cp6",
            imageUrl = "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600",
            gallery = listOf("https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600"),
            name = "Difusor Sándalo",
            shortDescription = "Difusor de ambientes de alta concentración con varillas de rattan natural.",
            fullDescription = "Perfuma tus espacios de manera continua durante más de 60 días. Sus varillas de fibra vegetal distribuyen sutilmente la esencia sin saturar el ambiente.",
            category = "Difusores",
            collection = "Esenciales",
            startingPrice = 19500.0,
            status = "Activo",
            sizes = listOf("250 ml"),
            aromas = listOf("Sándalo", "Ámbar"),
            sizePrices = mapOf("250 ml" to 19500.0)
        ),
        CatalogProduct(
            id = "cp7",
            imageUrl = "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600",
            gallery = listOf("https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600"),
            name = "Difusor Vainilla",
            shortDescription = "Aroma reconfortante y prolongado para salones y dormitorios.",
            fullDescription = "Fórmula equilibrada con extracto natural de vainilla y alcohol de cereales para máxima pureza y durabilidad.",
            category = "Difusores",
            collection = "Esenciales",
            startingPrice = 19500.0,
            status = "Activo",
            sizes = listOf("250 ml"),
            aromas = listOf("Vainilla"),
            sizePrices = mapOf("250 ml" to 19500.0)
        ),
        CatalogProduct(
            id = "cp8",
            imageUrl = "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=600",
            gallery = listOf("https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?w=600"),
            name = "Spray Textil Lavanda",
            shortDescription = "Aromatizante de telas, cortinas, almohadones y ropa de cama.",
            fullDescription = "Spray finamente atomizado que no rocia ni mancha los tejidos delicados. Ideal para utilizar antes de dormir en sábanas y cortinas.",
            category = "Textil",
            collection = "Textil Home",
            startingPrice = 12500.0,
            status = "Activo",
            sizes = listOf("500 ml"),
            aromas = listOf("Lavanda"),
            sizePrices = mapOf("500 ml" to 12500.0)
        )
    )

    val sampleClients = listOf(
        ClientMock("c1", "Sofía Martínez", "Minorista", "+54 9 11 4455-8822"),
        ClientMock("c2", "Laura Gómez", "Minorista", "+54 9 11 6622-9911"),
        ClientMock("c3", "Estudio Magnolia", "Mayorista / Estudio", "+54 9 11 3344-7788"),
        ClientMock("c4", "Casa Norte Concept", "Mayorista / Estudio", "+54 9 11 8899-2233")
    )
}
