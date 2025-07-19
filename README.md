# Textile Costing Application

A comprehensive web application for textile manufacturers and designers to map, calculate, and manage the costs of textile products including materials, processes, labor, and overhead expenses.

## Features

### 📊 **Dashboard**
- Overview of all materials, processes, labor rates, and products
- Quick stats and recent products summary
- Easy navigation to all application sections

### 🧵 **Materials Management**
- Add, edit, and delete textile materials
- Categorize materials (fabric, yarn, thread, dye, chemicals, accessories, etc.)
- Track cost per unit, supplier information, and descriptions
- Support for various units of measurement

### ⚙️ **Process Management**
- Manage textile processes (weaving, knitting, dyeing, printing, finishing, etc.)
- Different cost types: fixed cost, per unit, or per hour
- Track time requirements for hourly processes
- Categorize processes for better organization

### 👥 **Labor Rate Management**
- Set hourly rates for different positions/roles
- Include benefits and regional adjustments
- Support for multiple labor categories

### 🧮 **Cost Calculator**
- Interactive product cost calculator
- Select materials with quantities
- Add processes and their requirements
- Set overhead and profit margin percentages
- Real-time cost breakdown display
- Save calculated products for future reference

### 📦 **Product Management**
- View all calculated products
- Track total costs and selling prices
- Manage product database
- Delete products when no longer needed

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Forms**: React Hook Form
- **Storage**: Local Storage (client-side)
- **Charts**: Recharts (ready for reports)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd textile-costing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Usage Guide

### 1. Setting Up Materials

1. Navigate to the **Materials** section
2. Click **Add Material**
3. Fill in the material details:
   - Name (e.g., "Cotton Fabric", "Polyester Thread")
   - Category (fabric, yarn, thread, etc.)
   - Cost per unit
   - Unit of measurement (yard, meter, kg, piece)
   - Supplier (optional)
   - Description (optional)
4. Save the material

### 2. Adding Processes

1. Go to the **Processes** section
2. Click **Add Process**
3. Enter process information:
   - Name (e.g., "Screen Printing", "Cut & Sew")
   - Category (weaving, printing, sewing, etc.)
   - Cost type (fixed, per unit, or per hour)
   - Cost amount
   - Time required (for hourly processes)
4. Save the process

### 3. Setting Labor Rates

1. Visit the **Labor Rates** section
2. Click **Add Labor Rate**
3. Enter the position/role name
4. Set the hourly rate
5. The system will save the labor rate

### 4. Calculating Product Costs

1. Navigate to **Cost Calculator**
2. Enter product details:
   - Product name
   - Description
   - Labor time (in minutes)
   - Overhead percentage
   - Profit margin percentage

3. **Add Materials**:
   - Click "Add Material"
   - Select material from dropdown
   - Enter quantity needed
   - Cost auto-calculates

4. **Add Processes**:
   - Click "Add Process"
   - Select process from dropdown
   - Enter quantity (for per-unit processes)
   - Cost auto-calculates

5. **Review Cost Breakdown**:
   - Material costs
   - Process costs
   - Labor costs
   - Overhead calculations
   - Final selling price

6. **Save Product** for future reference

### 5. Managing Products

1. Go to **Products** section
2. View all saved products with their costs
3. Delete products no longer needed
4. Create new products via "Create Product" button

## Cost Calculation Logic

The application calculates costs using the following formula:

```
Material Cost = Σ(Material Unit Cost × Quantity)
Process Cost = Σ(Process Costs based on type)
Labor Cost = Labor Time (hours) × Average Hourly Rate
Direct Cost = Material Cost + Process Cost + Labor Cost
Overhead Cost = Direct Cost × Overhead Percentage
Total Cost = Direct Cost + Overhead Cost
Profit = Total Cost × Profit Margin Percentage
Selling Price = Total Cost + Profit
```

### Process Cost Types:
- **Fixed**: One-time cost regardless of quantity
- **Per Unit**: Cost multiplied by quantity
- **Per Hour**: Cost × (Time Required ÷ 60) × quantity

## Data Storage

The application uses browser Local Storage to persist data:
- `textile-materials`: All material data
- `textile-processes`: All process data  
- `textile-labor-rates`: All labor rate data
- `textile-products`: All saved product data

Data persists between browser sessions but is specific to each browser/device.

## Features in Development

- **Reports**: Comprehensive cost analysis and reporting
- **Export/Import**: CSV/Excel data export and import
- **Multi-currency**: Support for different currencies
- **Bulk Operations**: Bulk material and process management
- **Templates**: Product templates for common items
- **Cost History**: Historical cost tracking and trends

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or feature requests, please open an issue in the repository.

---

**Built for textile manufacturers, designers, and cost analysts who need accurate and efficient product costing.**
