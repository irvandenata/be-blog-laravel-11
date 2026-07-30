# Graph Report - .  (2026-07-29)

## Corpus Check
- 313 files · ~393,455 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2999 nodes · 3741 edges · 343 communities (206 shown, 137 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 160 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Query Builders
- Request Handlers
- Application Bootstrap
- Database Operations
- Article Features
- View Rendering
- Middleware Stack
- API CRUD Operations
- Frontend Components
- Component Registry
- Component 10
- Component 11
- Component 12
- Component 13
- Component 14
- Component 15
- Component 16
- Component 17
- Component 18
- Component 19
- Component 20
- Component 21
- Component 22
- Component 23
- Component 24
- Component 25
- Component 26
- Component 27
- Component 28
- Component 29
- Component 30
- Component 31
- Component 32
- Component 33
- Component 34
- Component 35
- Component 36
- Component 37
- Component 38
- Component 39
- Component 40
- Component 41
- Component 42
- Component 43
- Component 44
- Component 45
- Component 46
- Component 47
- Component 48
- Component 49
- Component 50
- Component 51
- Component 52
- Component 53
- Component 54
- Component 56
- Component 57
- Component 58
- Component 59
- Component 60
- Component 61
- Component 63
- Component 64
- Component 65
- Component 66
- Component 69
- Component 70
- Component 71
- Component 72
- Component 73
- Component 77
- Component 78
- Component 79
- Component 80
- Component 81
- Component 82
- Component 84
- Component 85
- Component 86
- Component 87
- Component 89
- Component 91
- Component 92
- Component 93
- Component 95
- Component 96
- Component 97
- Component 105
- Component 106
- Component 107
- Component 108
- Component 109
- Component 116
- Component 117
- Component 119
- Component 120
- Component 122
- Component 123
- Component 124
- Component 125
- Component 126
- Component 127
- Component 128
- Component 129
- Component 130
- Component 131
- Component 132
- Component 133
- Component 134
- Component 135
- Component 136
- Component 137
- Component 138
- Component 161
- Component 162
- Component 163
- Component 164
- Component 166
- Component 168
- Component 169
- Component 170
- Component 171
- Component 173
- Component 174
- Component 175
- Component 176
- Component 177
- Component 178
- Component 233
- Component 234
- Component 235
- Component 236
- Component 237
- Component 238
- Component 239
- Component 240
- Component 241
- Component 242
- Component 243
- Component 244
- Component 245
- Component 246
- Component 247
- Component 248
- Component 249
- Component 270
- Component 271
- Component 272
- Component 282
- Component 283
- Component 284
- Component 285
- Component 286
- Component 287
- Component 288
- Component 289
- Component 290
- Component 298
- Component 299
- Component 300
- Component 301
- Component 302
- Component 303
- Component 304
- Component 305
- Component 316
- Component 317
- Component 318
- Component 319
- Component 320
- Component 321
- Component 322
- Component 323
- Component 324
- Component 325
- Component 326
- Component 335
- Component 336
- Component 338
- Component 339
- Component 340
- Component 341

## God Nodes (most connected - your core abstractions)
1. `Eloquent` - 299 edges
2. `Request` - 189 edges
3. `App` - 144 edges
4. `DB` - 117 edges
5. `Route` - 81 edges
6. `View` - 80 edges
7. `Schema` - 75 edges
8. `Storage` - 73 edges
9. `Session` - 68 edges
10. `Auth` - 67 edges

## Surprising Connections (you probably didn't know these)
- `down()` --calls--> `Schema`  [INFERRED]
  database/migrations/0001_01_01_000000_create_users_table.php → _ide_helper.php
- `up()` --calls--> `Schema`  [INFERRED]
  database/migrations/0001_01_01_000000_create_users_table.php → _ide_helper.php
- `down()` --calls--> `Schema`  [INFERRED]
  database/migrations/0001_01_01_000001_create_cache_table.php → _ide_helper.php
- `up()` --calls--> `Schema`  [INFERRED]
  database/migrations/0001_01_01_000001_create_cache_table.php → _ide_helper.php
- `down()` --calls--> `Schema`  [INFERRED]
  database/migrations/0001_01_01_000002_create_jobs_table.php → _ide_helper.php

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Primary Design Theme** — color_primary, button_variant_default, sticky_navbar_brand, og_default_accent_bar, card_3d_read_more_button [INFERRED]
- **Dark Mode Implementation** — color_scheme_dark, ui_button_component, ui_card_component, sticky_navbar_component, ui_color_mode_hook [INFERRED]
- **3D Card Interactive System** — card_3d_component, ui_3d_card_container, ui_3d_card_body, ui_3d_card_item, 3d_card_context_api, 3d_transformation_logic, ui_3d_mouse_enter_hook [INFERRED]
- **Navigation and Routing** — sticky_navbar_component, sticky_navbar_sections, sticky_navbar_mobile_menu, page_title_component, tech_stack_react_router [INFERRED]
- **Typography Scale and Families** — index_css_fonts, og_default_typography_headline, og_default_typography_secondary, og_default_typography_cta, sticky_navbar_brand [INFERRED]
- **Form Components and Inputs** — ui_button_component, form_validation_pattern, file_upload_styling, table_checkbox_styling, admin_panel_component_layer [INFERRED]
- **Image and Visual Assets** — og_default_svg, card_3d_image_container, responsive_image_optimization, og_default_glow_effect, og_default_grid_pattern [INFERRED]
- **Responsive Design Pattern** — responsive_breakpoint_lg, sticky_navbar_responsive_behavior, sticky_navbar_mobile_menu, utility_chat_height, admin_panel_component_layer [INFERRED]
- **Light Theme System** — logo_full_light, color_palette_text_light, color_palette_background [INFERRED]
- **Dark Theme System** — logo_full_dark, color_palette_text_dark, color_palette_primary [INFERRED]
- **UI Icon Set** — icon_arrow_down, icon_sun, icon_moon, icon_calendar, icon_copy_alt [INFERRED]
- **Brand Integration Icons** — brand_google, brand_icon_02, brand_icon_03, brand_icon_04, brand_icon_05 [INFERRED]
- **Country/Region Assets** — country_flag_01, country_flag_02, country_flag_03, country_flag_04, country_flag_05, country_flag_06 [INFERRED]
- **Brand Identity System** — logo_full_light, logo_full_dark, logo_icon, color_palette_primary, style_logo_geometric [INFERRED]

## Communities (343 total, 137 thin omitted)

### Community 4 - "Article Features"
Cohesion: 0.06
Nodes (13): FeedController, OgImageController, PageController, RobotsController, SitemapController, Article, SeoSetting, PageMetaService (+5 more)

### Community 7 - "API CRUD Operations"
Cohesion: 0.06
Nodes (48): createComment(), createData(), deleteDataById(), fetchComments(), fetchData(), fetchDataCategories(), fetchDataNoAuth(), getDataById() (+40 more)

### Community 8 - "Frontend Components"
Cohesion: 0.05
Nodes (44): MouseEnterContext, 3D Transform Calculation, Button Variant: Default, Button Variant: Destructive, Button Variant: Ghost, Button Variant: Outline, Button Variant: Secondary, Card3D Category Badge (+36 more)

### Community 14 - "Component 14"
Cohesion: 0.06
Nodes (35): autoprefixer, laravel-vite-plugin, devDependencies, autoprefixer, laravel-vite-plugin, postcss, tailwindcss, @types/draft-js (+27 more)

### Community 20 - "Component 20"
Cohesion: 0.06
Nodes (30): DOM, DOM.Iterable, ES2020, resources/js/**/*.ts, resources/js/**/*.tsx, resources/js/vite-env.d.ts, compilerOptions, allowImportingTsExtensions (+22 more)

### Community 24 - "Component 24"
Cohesion: 0.14
Nodes (9): ArticleImage, ArticleTag, Category, Comment, CustomInformation, InformationType, Tag, Illuminate\Database\Eloquent\Factories\HasFactory (+1 more)

### Community 27 - "Component 27"
Cohesion: 0.11
Nodes (12): react, react, CardGetInTouch(), generateCaptcha(), FloatingButton(), SearchableSelect(), SocialMediaButton(), AnimateSection() (+4 more)

### Community 28 - "Component 28"
Cohesion: 0.16
Nodes (9): ArticleResource, BaseResource, CategoryResource, ContactMessageResource, CustomInformationResource, Resource, index(), Illuminate\Http\Request (+1 more)

### Community 31 - "Component 31"
Cohesion: 0.08
Nodes (24): ./dist/pages/*, ES2023, vite.config.js, compilerOptions, allowImportingTsExtensions, baseUrl, forceConsistentCasingInFileNames, isolatedModules (+16 more)

### Community 37 - "Component 37"
Cohesion: 0.13
Nodes (6): CategoryController, LoginController, InformationTypeController, SeoSettingController, SettingController, Controller

### Community 41 - "Component 41"
Cohesion: 0.11
Nodes (12): App(), AdminLayout, ArticleCategoryPage, ArticlePage, ArticleTagPage, ContactMessagePage, CustomInformationPage, CustomInformationTypePage (+4 more)

### Community 42 - "Component 42"
Cohesion: 0.16
Nodes (8): ClickOutside(), Props, DarkModeSwitcher(), DropdownNotification(), formatDate(), useColorMode(), SetValue, useLocalStorage()

### Community 43 - "Component 43"
Cohesion: 0.23
Nodes (18): Neutral Color Palette, Primary Color Palette, Dark Text Color, Light Text Color, Arrow Down Icon, Calendar Icon, Copy Icon (Alt), Moon Icon (+10 more)

### Community 46 - "Component 46"
Cohesion: 0.12
Nodes (16): aliases, blocks, components, examples, ui, utils, rsc, $schema (+8 more)

### Community 48 - "Component 48"
Cohesion: 0.20
Nodes (7): ArticleController, CommentResource, destroy(), show(), store(), update(), Illuminate\Http\JsonResponse

### Community 54 - "Component 54"
Cohesion: 0.22
Nodes (6): User, DatabaseSeeder, Illuminate\Database\Seeder, Illuminate\Foundation\Auth\User, Illuminate\Notifications\Notifiable, Tymon\JWTAuth\Contracts\JWTSubject

### Community 57 - "Component 57"
Cohesion: 0.17
Nodes (12): Blog API - Laravel 11, Category Management, Comments System, CORS Support, Pagination, Post Management, Search Functionality, User Authentication (+4 more)

### Community 58 - "Component 58"
Cohesion: 0.17
Nodes (12): scripts, post-autoload-dump, post-create-project-cmd, post-root-package-install, post-update-cmd, Illuminate\\Foundation\\ComposerScripts::postAutoloadDump, @php artisan key:generate --ansi, @php artisan migrate --graceful --ansi (+4 more)

### Community 59 - "Component 59"
Cohesion: 0.17
Nodes (10): IArticle, IArticleCategory, IArticleCategoryCreate, IArticleCategoryTable, IArticleCreate, IArticleTable, IArticleTag, IArticleTagCreate (+2 more)

### Community 60 - "Component 60"
Cohesion: 0.22
Nodes (3): StoreInformationTypeRequest, UpdateInformationTypeRequest, Illuminate\Foundation\Http\FormRequest

### Community 65 - "Component 65"
Cohesion: 0.20
Nodes (9): autoload-dev, psr-4, description, license, minimum-stability, name, prefer-stable, Tests\\ (+1 more)

### Community 66 - "Component 66"
Cohesion: 0.20
Nodes (10): require, intervention/image, intervention/image-laravel, laravel/framework, laravel/tinker, php, resend/resend-laravel, symfony/http-client (+2 more)

### Community 69 - "Component 69"
Cohesion: 0.28
Nodes (3): Input, InputProps, Label

### Community 70 - "Component 70"
Cohesion: 0.22
Nodes (6): FieldDef, FieldType, GENERATED_FILES, SectionDef, SECTIONS, SeoFieldProps

### Community 71 - "Component 71"
Cohesion: 0.43
Nodes (4): AuthMiddleware, CorsMiddleware, Closure, Symfony\Component\HttpFoundation\Response

### Community 73 - "Component 73"
Cohesion: 0.25
Nodes (8): require-dev, barryvdh/laravel-ide-helper, fakerphp/faker, laravel/pint, laravel/sail, mockery/mockery, nunomaduro/collision, phpunit/phpunit

### Community 77 - "Component 77"
Cohesion: 0.39
Nodes (5): CardBody(), CardContainer(), CardItem(), MouseEnterContext, useMouseEnter()

### Community 79 - "Component 79"
Cohesion: 0.43
Nodes (4): SendMail, Illuminate\Bus\Queueable, Illuminate\Mail\Mailable, Illuminate\Queue\SerializesModels

### Community 80 - "Component 80"
Cohesion: 0.33
Nodes (3): UserFactory, Illuminate\Database\Eloquent\Factories\Factory, static

### Community 81 - "Component 81"
Cohesion: 0.29
Nodes (7): axios, clsx, dependencies, axios, clsx, react-redux, react-redux

### Community 82 - "Component 82"
Cohesion: 0.29
Nodes (7): pestphp/pest-plugin, php-http/discovery, config, allow-plugins, optimize-autoloader, preferred-install, sort-packages

### Community 84 - "Component 84"
Cohesion: 0.29
Nodes (6): Button, ButtonProps, ButtonSize, ButtonVariant, sizes, variants

### Community 85 - "Component 85"
Cohesion: 0.29
Nodes (6): AlertDialogProps, CustomTableProps, DynamicModalProps, ImageDetailModalProps, ITable, ITableField

### Community 86 - "Component 86"
Cohesion: 0.29
Nodes (6): ICustomInformation, ICustomInformationCreate, ICustomInformationTable, ICustomInformationType, ICustomInformationTypeCreate, ICustomInformationTypeTable

### Community 91 - "Component 91"
Cohesion: 0.40
Nodes (3): Illuminate\Foundation\Testing\TestCase, ExampleTest, TestCase

### Community 93 - "Component 93"
Cohesion: 0.33
Nodes (5): Card, CardContent, CardDescription, CardHeader, CardTitle

### Community 95 - "Component 95"
Cohesion: 0.33
Nodes (4): colors, {
    default: flattenColorPalette,
}, defaultTheme, flowbite

### Community 97 - "Component 97"
Cohesion: 0.40
Nodes (5): autoload, psr-4, App\\, Database\\Factories\\, Database\\Seeders\\

### Community 106 - "Component 106"
Cohesion: 0.50
Nodes (4): Admin Panel Component Classes, Tailwind CSS Setup, Chat Height Utility, No Scrollbar Utility

### Community 107 - "Component 107"
Cohesion: 0.50
Nodes (4): Google Brand Icon, Background Color, Google OAuth Colors, Medium Icon Size

### Community 108 - "Component 108"
Cohesion: 0.50
Nodes (4): extra, laravel, dont-discover, barryvdh/laravel-ide-helper

### Community 109 - "Component 109"
Cohesion: 1.00
Nodes (3): Arr, Js, Number

### Community 120 - "Component 120"
Cohesion: 0.50
Nodes (3): IContactMessage, IContactMessageNotification, IContactMessageTable

### Community 122 - "Component 122"
Cohesion: 0.67
Nodes (3): keywords, framework, laravel

### Community 123 - "Component 123"
Cohesion: 0.67
Nodes (3): Country Flag 01 (US), Filter-based Shadow, Small Flag Size

## Knowledge Gaps
- **233 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+228 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **137 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Eloquent` connect `Query Builders` to `Article Features`, `Component 23`, `Component 26`, `Component 180`, `Component 62`, `Component 67`, `Component 197`, `Component 200`, `Component 202`, `Component 74`, `Component 203`, `Component 205`, `Component 206`, `Component 207`, `Component 208`, `Component 209`, `Component 210`, `Component 83`, `Component 90`, `Component 98`, `Component 109`, `Component 114`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `Request` connect `Request Handlers` to `Article Features`, `Component 10`, `Component 140`, `Component 12`, `Component 16`, `Component 144`, `Component 21`, `Component 151`, `Component 152`, `Component 153`, `Component 154`, `Component 29`, `Component 158`, `Component 159`, `Component 32`, `Component 160`, `Component 47`, `Component 182`, `Component 185`, `Component 186`, `Component 62`, `Component 67`, `Component 72`, `Component 206`, `Component 207`, `Component 88`, `Component 90`, `Component 99`, `Component 227`, `Component 228`, `Component 229`, `Component 102`, `Component 230`, `Component 109`, `Component 110`, `Component 111`, `Component 115`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `App` connect `Application Bootstrap` to `Component 139`, `Component 140`, `Component 141`, `Component 16`, `Component 21`, `Component 29`, `Component 32`, `Component 44`, `Component 179`, `Component 180`, `Component 181`, `Component 182`, `Component 55`, `Component 183`, `Component 62`, `Component 67`, `Component 74`, `Component 88`, `Component 98`, `Component 109`, `Component 110`, `Component 111`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Request` (e.g. with `.getDataBySlug()` and `.__construct()`) actually correct?**
  _`Request` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `DB` (e.g. with `.update()` and `.createComment()`) actually correct?**
  _`DB` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _233 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Query Builders` be split into smaller, more focused modules?**
  _Cohesion score 0.007220216606498195 - nodes in this community are weakly interconnected._